> https://dev.to/madsstoumann/data-attributes-vs-bem-2k6n

I used to be a comicbook-letterer, so "BEM" always looked wrong to me. It's either "BAM!" — or "BOOM!" … Sorry, I couldn't resist that!

In a CMS-interface, editors sometimes have the option to customize the rendering of a component.

In an Accordion-Component, as an example, an editor might be able to chose the type of fold-out-icon to use from a drop-down:

“Down Arrow”
“Right Arrow”
“Plus”
The editor might even have the option to chose an icon per item in the accordion — if the accordion has several levels — as we often see in mobile navigation.

The backend for the accordion will most likely store the selection in a SelectionFacory (or similar), which is a bunch of key/value-pairs, where value is the one displayed to the editor, and key is the one we'll use in the rendered markup:

@Model.cssIcon
Now, instead of outputting the value to a class-attribute, we can output it to a data-attribute with the same name (just in kebab-case) as the data-model:

<span data-css-icon="@Model.cssIcon">Item</span>
This way, the backend and frontend is linked, and easy to read for both types of developers.

The key in this example is "down-arrow", so to target that in CSS, we'll use the attribute selector:

[data-css-icon="down-arrow"] { /*…*/ }
If all the accordion-icons have something in common, these — more generic styles — can be placed in:

[data-css-icon] { /* common */ } 
And if he editor should be allowed to add more modifiers, as an example "circle" or "fill", we can use the "contains *"-operator:

[data-css-icon*="circle"] { /*…*/ }
And in HTML:

<span data-css-icon="down-arrow circle fill">Item</span>
Here's a Codepen with a bunch of CSS Only Icons, with (clickable) modifiers:



CSS Badges
Let's look at another example that would typically require a lot of BEM-modifiers.

Imagine a List-Control or a Menu-Component, where an editor will be able to add text either before or after an item. This could be a colored circle with" NEW" after a product-name, the infamous red notification-badge with a number,

The CMS-implementation could be:

type (badge, circle, dot, pill)
color
horizontal position (left, right)
vertical position (bottom, top)
Instead of:

<button class="c-txt c-txt--badge c-txt--color-red c-txt--posv-top c-txt--posh-left" data-text="NEW">
It could be:

<button data-text-type="red badge top left" data-text="NEW">
CSS in data-attributes are probably a bit slower to parse (since I'm using the containing: *-selector), but easier to read, and easier for backend-developers to implement/understand.

Here's a Codepen with a bunch of CSS Badges:


What do you think?!

Thanks for reading?