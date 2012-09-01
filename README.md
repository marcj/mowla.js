# Mowla.js - Shizzle dizzle JavaScript Template Engine

## What?

A template engines that compiles html sourcecode to javascript code.

This means nothing is true, everything is permitted. ;-)


## Demo
```html
<script type="text/javascript" src="mowla.js" ></script>
<script type="text/javascript">

    var data = {
        name: 'peter',
        tags: ['peter', 'you', 'are', 'a', 'mowla']
    }

    var templateSource = 'Hi {name}!<br/>'+
    '{foreach tags as tag}'+
        '<a href="/tag/{tag}">{tag}{if !last}, {/if}'+
    '{/foreach}';

    var renderedTemplate = mowla(templateSource, data);
    document.write(renderedTemplate); //Hi peter! ...

</script>
```

## API
Please look at the docs above the functions. It's well documented.

Main functions are:

```javascript

    //Renders source and returns the rendered shizzle.
    var rendered = mowla('Hello {name}', {name: 'Mowla'});

    //Renders source of the element's html and apply the rendered shizzle to the same element.
    mowlaRender(document.getElementById('container'), {name: 'Mowla'});

```

## Usage

Actually, anything is possible, what in javascript is possible, but there's also
some additional calls available.

### Output

```html
    
    Normal variable: My name is {name}.

    Paths possible: {mySettings.sub.item}

    {var temp = 'item'}
    Same as above: {mySettings.sub[temp]}

    {myFunction()}
    <!-- calls myFunction and prints the result.
    If you want to suppress the output, scroll down to #Calls. -->

    {myArray.join(',')} <!-- ofcourse, all javascript calls are possible -->

```

### Condition

Anything is possible.
```html
    
    {if name == 'peter' && isHoly()}
        Sure, peter, you're holy.
    {else}
        Go away.
    {/if}

```

### Assigment

Anything is possible.
If you assign a value to a var inside of a loop, then the var is only visible inside this loop. Just declare the var outside of the loop to make it global visible.
```html

    {var name = 'Mowla'}
    {var item = otherVar.item}

    {var visible=true}

    {foreach message as message}
        {if visible}It's true.{/if}
        {var insideLoopVisible=true}
    {/foreach}

    {insideLoopVisible} //error, undefined

```

### Loops

Do not use brakes inside the statemet.

```html

    <!-- loop through objects or arrays -->
    {foreach myArray as item}
        {item}
        last: {last}   <!-- (boolean) if last iteration -->
        first: {first} <!-- (boolean) if first iteration -->
        index: {index} <!-- (integer) index, started with 1 -->
    {/foreach}

    <!-- regular javascript style -->
    {for var i=0; i<10; i++}
        {i}
    {/for}

    <!-- regular javascript style -->
    {var i=0}
    {while i < 10}
        {i++}
    {/for}

```

### Calls

If you have function calls, which should not generate output, use following.

```html

    {call myFunction()}
    
```

### IMPORTANT

If you need to use { and } in your statesment, do escape it!
Example:

```html
    
    {call if(true)\{ console.log('yay!') \}}

```

You have access to the output through the _ var.
Example:
```html
    
    {call if(true)\{ _ += 'yay!' \}}

    {_} <!-- prints the code till to this line -->
    {_.substr(0,10)} <!-- prints the code till to this line but only the first 10 chars -->

```

To use { and } in regular way, just esacpe it.

```html

    \{exampleFromDocu\}

```


## Why mowla?
Because I love (actually hate) silly labels for libs. :>