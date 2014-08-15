"use strict";
var util = require('util'),
  Core = require('facet-core').Core,
  ProductsAPI = require('facet-product'),
  CategoriesAPI = require('facet-category');

/**
 * Catalog API constructor
 * 
 * @param   {Object}  options   Options object - must contain 'db' (mongoose instance)
 *                              and 'intercom' (EventEmitter instance) keys.
 *
 * @return  {void} 
 */
var CatalogAPI = function( options ){
  
  // set the options
  this.setCommonAttributes( options );

  // check the contraints and set the custom modules
  if( this.options.hasOwnProperty("ProductsAPI") && this.checkConstraints( this.options.ProductsAPI ) ) {
    ProductsAPI = this.options.ProductsAPI;
  }
  if( this.options.hasOwnProperty("CategoriesAPI") && this.checkConstraints( this.options.CategoriesAPI ) ) {
    CategoriesAPI = this.options.CategoriesAPI;
  }

  // instantiate the api modules
  this.Products = new ProductsAPI( this.options );
  this.Categories = new CategoriesAPI( this.options );

  // register catalog's events
  this.registerEvents();

  // register catalog's routes
  this.registerRoutes();
};

/**
 * Catalog API inherits from Core
 */
util.inherits(CatalogAPI, Core);


CatalogAPI.prototype.registerEvents = function() {

  var _this = this;
  
  // bind events and add the routes for product categories
  this.Products.intercom.on( 'facet:product:category:find', function( query, successCb, errorCb ){
    query.fields = 'categories';
    query['populate'] = 'categories';
    return _this.Products.intercom.emit('facet:product:findone', query, successCb, errorCb);
  });

  // bind events and add the routes for category products
  this.Categories.intercom.on( 'facet:category:product:find', function( query, successCb, errorCb ){
    // query.fields = '_id';
    var productQuery = {
      conditions: {
        categories: query.conditions._id
      }
    };

    // find all the products that have this category
    return _this.Products.find(productQuery, 
      function(data){
        var categoryData = {
          _id: query.conditions._id,
          products: data
        };
        _this.Products.intercom.emit(_this.Products._respondFacetEvent, categoryData);  
      }, 
      this.defaultErrorCb);
  });

};


CatalogAPI.prototype.registerRoutes = function() {

  this.Products.routerManifest.addRoutes([
    { verb: 'GET', route: '/:productId/categories', emit: 'facet:product:category:find' },  // GET all the categories for the product
  ]);
  this.Categories.routerManifest.addRoutes([
    { verb: 'GET', route: '/:categoryId/products', emit: 'facet:category:product:find' }, // GET all the products for the category
  ]);

};

// export the main function
exports = module.exports = CatalogAPI;
