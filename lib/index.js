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

};

/**
 * Catalog API inherits from Core
 */
util.inherits(CatalogAPI, Core);

// export the main function
exports = module.exports = CatalogAPI;
