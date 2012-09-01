/**
 * Mowla javascript template 'engine'.
 * 
 * Licensed under the shizzle dizzle MIT license.
 *
 * @author MArc Schmidt <https://github.com/MArcJ>
 */

(function(){
    var cache = {};

    this.mowla = {};


    /**
     * Renders the source and returns the rendered shizzle.
     * @param  {String} pSource Template sourcecode
     * @param  {Object} pData   Data to use. Default is window.
     * @return {String} Shizzeled sourcecode.
     */
    this.mowla.fetch = function(pSource, pData){
        if (!pData) pData = window;
        if(typeof(pSource) == 'object' && 'innerHTML' in pSource)
            return mowla.fetch(mowla.htmlEntities(pSource.innerHTML), pData);
        return (cache[pSource] || (cache[pSource] = mowla.compile(pSource)))(pData);
    };


    /**
     * Renders the content of an element and replace it with the rendered shizzle.
     * @param  {Element} pSource The DOM element
     * @param  {Object}  pData   Data to use. Default is window.
     */
    this.mowla.render = function(pSource, pData){
        pSource.innerHTML = mowla.fetch(pSource, pData);
    };


    /**
     * Compiles the template source and returns the function.
     * @param  {String} pSource Template sourcecode
     * @return {Function} The created function with one 'data' argument.
     */
    this.mowla.compile = function(pSource){
        try {
           return new Function('data', code = mowla.getCode(pSource));
        } catch(e){
            if (typeof(console) != 'undefined'){
                console.log('[mowla.compile] error in following generated code');
                console.log(code);
            }
            throw e;
        }
    };


    /**
     * Generates the javascript code from the html sourcecode.
     * @internal
     * @param  {String} pSource
     * @return {String}
     */
    this.mowla.getCode = function(pSource){
        return 'with(data){ var ___ = \''+
            pSource
                .replace(/\n/g, "'+\"\\n\"\n+'")

                .replace(/([^\\])\{\/(if|for|while)\}/g, "$1'; \\} ___ += \'") //close if
                .replace(/([^\\])\{else\}/g, "$1'; \\} else \\{ ___ += \'") //close if
                .replace(/([^\\])\{\/foreach\}/g, "$1'; \\}); ___ += \'") //close foreach
                .replace(/([^\\])\{foreach ([^\}]*) as ([^\}]*)\}/g, "$1'; mowla.forEach($2, function($3, first, last, index)\\{ _ += \'") //foreach shorty
                
                .replace(/([^\\])\{call ([^\}\\]*(?:\\.[^}\\]*)*)\}/g, "$1'; $2; ___ += \'") //silent calls
                .replace(/([^\\])\{html ([^\}\\]*(?:\\.[^}\\]*)*)\}/g, "$1'; ___ += ($2); ___ += \'") //escape outputs
                .replace(/([^\\])\{(if|for|while) ([^}]*)\}/g, "$1'; $2 ($3) \\{ ___ += \'") //if, for, while
                .replace(/([^\\])\{var ([^}]*)\}/g, "$1'; ($2); ___ += \'")

                .replace(/([^\\])\{/g, "$1'; ___ += mowla.escape(") //{
                .replace(/([^\\])\}/g, "$1); ___ += \'") //}

                .replace(/\\\{/g, '{')
                .replace(/\\\}/g, '}')+
            '\'; return ___;}';
    };


    /**
     * Returns the size of the array/object.
     * @internal
     * @param  {mixed} pArObj A array or object
     * @return {integer} The size
     */
    this.mowla.length = function(pArObj){
        if (Object.prototype.toString.call(pArObj) === '[object Array]') return pArObj.length;

        if ('keys' in Object)
            return Object.keys(pArObj).length;
        else {
            var size = 0;
            for (var i in pArObj)
                if (pArObj.hasOwnProperty(i)) size++;
            return size;
        }
    };


    /**
     * Foreach loop for arrays and objects.
     *
     * @internal
     * @param  {mixed} pArObj  A array or object
     * @param  {Function} pCb  pCallback function for each item
     */
    this.mowla.forEach = function(pArObj, pCb){
        var i = 0;
        var length = mowla.length(pArObj);
        if (Object.prototype.toString.call(pArObj) !== '[object Array]') {
            for (i in pArObj)
                if (pArObj.hasOwnProperty(i)) pCb(pArObj[i], i==0, i==length-1, (i++)+1);
        } else {
            for (i=0; i<length; i++)
                pCb(pArObj[i], (i==0)?true:false, i==length-1, i+1);
        }
    };


    /**
     * Escapes pValue so you can use it safly in HTML.
     * Replaces < and > with &lt; and &gt;
     * @param  {String} pValue
     * @return {String} Filtered string
     */
    this.mowla.escape = function(pValue){
        return typeof(pValue) == 'string' ? pValue.replace(/</g, '&lt;').replace(/>/g, '&gt;') : pValue;
    };


    /**
     * Replaces HTML entities which we need for javascript operations.
     * @param  {String} pHtml
     * @return {String}
     */
    this.mowla.htmlEntities = function(pHtml){
        return pHtml.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
    };


})();