
var util = require('util')
  , ProductAPI = require('facet-product')
  , CategoryAPI = require('facet-category')
  ;

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
  this.setOptions(options);

  // check the contraints and set the custom modules
  if( this.options.hasOwnProperty("ProductsAPI") && this.checkConstraints( this.options.ProductsAPI ) ) {
    ProductAPI = this.options.ProductsAPI;
  }
  if( this.options.hasOwnProperty("CategoriesAPI") && this.checkConstraints( this.options.CategoriesAPI ) ) {
    CategoryAPI = this.options.CategoriesAPI;
  }

  // instantiate the api modules
  this.Products = new ProductAPI( this.options );
  this.Categories = new CategoryAPI( this.options );

  // register the events
  this.registerEvents();
};

/**
 * Registers Catalog API event listeners
 * 
 * @return  {void}
 */
CatalogAPI.prototype.registerEvents = function() {

};

/**
 * Binds product and category routes to the provided router instance.
 * 
 * @param   {Object}   router         Router instance (express, koa, custom, etc)
 * @param   {Object}   routeOptions   Options for route setup.
 * 
 * @return  {void}
 */
CatalogAPI.prototype.bindRoutes = function( router, routeOptions ) {

  // set the router
  this.router = router;

  // iterate through the routeOptions 
  for( var route in routeOptions.routes ) {
    var api = routeOptions.routes[route];

    if( this.hasOwnProperty(api) ) {
      this[api].bindRoutes( this.router, {'route': route} );
    }
    else {
      // TODO: emit or log error about incorrect route binding attempt
    }
  }

  return this.router;

};

// export the main function
exports = module.exports = CatalogAPI;
