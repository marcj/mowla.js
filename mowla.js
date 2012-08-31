/**
 * Mowla javascript template 'engine'.
 * 
 * Licensed under the shizzel dizzle MIT license.
 *
 * @author MArc Schmidt <https://github.com/MArcJ>
 */
(function(){

    var cache = {};

    this.mowlaForEach = function(pArObj, pCb){
        var i = 0;
        if (typeOf(pArObj) == 'object'){
            for (i in pArObj) pCb(pArObj[i], i++);
        } else {
            for (len = pArObj.length; i<len; i++) pCb(pArObj[i], i);
        }
    }

    this.mowlaRender = function(pSource, pData){
        console.log(mowla(pSource, pData));
        //pSource.innerHTML = mowla(pSource, pData);
    }

    this.mowla = function(pSource, pData){
        if (!pData) pData = window;
        if(typeof(pSource) == 'object' && 'innerHTML' in pSource) return mowla(pSource.innerHTML, pData);

        var code = 'with(data){ result = \''+
                pSource
                    .replace(/\n/g, "'+\"\\n\"\n+'")
                    .replace(/\{\/if\}/g, "'; \} result = \'") //close if
                    //.replace(/\{\/foreach\}/g, "'; \}); result = \'") //close foreach
                    //.replace(/\{foreach ([^\}]*) as ([^\}]*)\}/, "'; mowlaForEach\($1, function\($2, index\){") //foreach shorty
                    .replace(/\{if (.*)\}/g, "'; if ($1){ \nresult = \'") //anything else
                    //.replace(/\{([^\}]*)\}/g, "'; \nresult += $1;\nresult = \'") //anything else

                + '\'; return result;}';
                console.log(code);
        return (cache[pSource] || (cache[pSource] = new Function('data', code)))(pData);
    }

})();