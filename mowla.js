/**
 * Mowla javascript template 'engine'.
 * 
 * Licensed under the shizzle dizzle MIT license.
 *
 * @author MArc Schmidt <https://github.com/MArcJ>
 */

(function(){

    var cache = {};

    /**
     * Returns the size of the array/object.
     * 
     * @internal
     * @param  {mixed} pArObj A array or object
     * @return {integer} The size
     */
    this.mowlaLength = function(pArObj){
        if (typeof(pArObj) == 'array') return pArObj.length;

        if ('keys' in Object)
            return Object.keys(pArObj).length;
        else {
            var size = 0;
            for (i in pArObj) if (pArObj.hasOwnProperty(i)) size++;
            return size;
        }
    }

    /**
     * Foreach loop for arrays and objects.
     *
     * @internal
     * @param  {mixed} pArObj  A array or object
     * @param  {Function} pCb  pCallback function for each item
     */
    this.mowlaForEach = function(pArObj, pCb){
        var i = 0;
        var length = this.mowlaLength(pArObj);
        if( Object.prototype.toString.call(pArObj) !== '[object Array]' ) {
            for (i in pArObj) if (pArObj.hasOwnProperty(i)) pCb(pArObj[i], i==0, i==length-1, (i++)+1);
        } else {
            for (len = pArObj.length; i<len; i++) pCb(pArObj[i],  i==0, i==length-1, i+1);
        }
    }

    /**
     * Renders the content of an element and replace it with the rendered shizzle.
     * 
     * @param  {Element} pSource The DOM element
     * @param  {Object}  pData   Data to use. Default is window.
     */
    this.mowlaRender = function(pSource, pData){
        pSource.innerHTML = mowla(pSource, pData);
    }

    /**
     * Compiles the template source and returns the function.
     * 
     * @param  {String} pSource Template sourcecode
     * @return {Function} The created function with one 'data' argument.
     */
    this.mowlaCompile = function(pSource){
        try {
            return new Function('data', mowlaGetCode(pSource));
        } catch(e){
            
        }
    },

    /**
     * Generates the javascript code from the html sourcecode.
     * 
     * @internal
     * @param  {String} pSource
     * @return {String}
     */
    this.mowlaGetCode = function(pSource){
        return 'with(data){ _ = \''+
            pSource
                .replace(/\n/g, "'+\"\\n\"\n+'")

                .replace(/([^\\])\{\/(if|for|while)\}/g, "$1'; \\} _ += \'") //close if
                .replace(/([^\\])\{else\}/g, "$1'; \\} else \\{ _ += \'") //close if
                .replace(/([^\\])\{\/foreach\}/g, "$1'; \\}); _ += \'") //close foreach
                .replace(/([^\\])\{foreach ([^\}]*) as ([^\}]*)\}/g, "$1'; mowlaForEach\($2, function\($3, first, last, index\)\\{ _ += \'") //foreach shorty
                
                .replace(/([^\\])\{call ([^\}\\]*(?:\\.[^}\\]*)*)\}/g, "$1'; $2; _ += \'") //anything else
                .replace(/([^\\])\{(if|for|while) ([^}]*)\}/g, "$1'; $2 ($3) \\{ _ += \'") //anything else
                .replace(/([^\\])\{var ([^}]*)\}/g, "$1'; ($2); _ += \'") //anything else

                .replace(/([^\\]){/g, "$1'; _ += (") //{
                .replace(/([^\\])}/g, "$1); _ += \'") //}

                .replace(/\\{/g, '{')
                .replace(/\\}/g, '}')

            + '\'; return _;}'
    }

    /**
     * Replaces HTML entities which we need for javascript operations.
     * 
     * @param  {String} pHtml
     * @return {String}
     */
    this.mowlaHtmlEntities = function(pHtml){
        return pHtml.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
    }

    /**
     * Renders the source and returns the rendered shizzle.
     * 
     * @param  {String} pSource Template sourcecode
     * @param  {Object} pData   Data to use. Default is window.
     * @return {String} Shizzeled sourcecode.
     */
    this.mowla = function(pSource, pData){
        if (!pData) pData = window;
        if(typeof(pSource) == 'object' && 'innerHTML' in pSource)
            return mowla(mowlaHtmlEntities(pSource.innerHTML), pData);
        return (cache[pSource] || (cache[pSource] = mowlaCompile(pSource)))(pData);
    }

})();