Social-feed
===========
A YII extension which shows a user feed from the most popular social networks.<br/> 
Currently supports: <a href="http://facebook.com">Facebook</a>, <a href="http://twitter.com">Twitter</a>, <a href="http://vk.com">VK</a>
<hr>
If you use this extension, please <a href="mailto:shaan@uexel.com">write me a short message</a> with a link to the project where you embed the extension, and what would 
you like to have more in the extension. It will help me to stay focused on the important issues and see the global picture!
<br/><strong>It is not mandatory, but i will really appreciate it!</strong>
<p>
<strong>Attention:</strong> After Twitter has prohibided an anonymous fetching of tweets - this function is currently not supported. Wait an update with a fix.
</p>
<hr>
<h4>Getting started</h4>

Initialize the social-feed extension:

        <?php
    $this->widget('ext.socialfeed.SocialFeed', array(
        'fb_token' => '150849908413827|uYDHoXrvPZOLkQ-zRz_XoYdEeYM', // FB Token
        'template' => 'template.html', // template
         'fb_username' => 'uexel', // required facebook username
        'show_media' => false, // optional true|false (default: true)
        'length' => 500, // length of post
        'fb_limit' => 5, // number of post you wanna show
        'cookies' => true, // optional true|false (default: true)
    ));
    ?>

If you want to change the layout of the feed, you can do it in the <em>template.html</em> file.
<br/>
If you don't need to show the feed from all supported social networks, put the credentials only for those you need.
<br/>
The Facebook requires an access token in order to get the feed of the user (even if it is public).
To use Facebook feed, please <a href="https://developers.facebook.com/apps">register an application</a>, generate a token and 
put it in  <em>fb_token</em>.<br/>
<strong>Attention!</strong> A current version of extension does not fully support IE browser. Please follow the process of solving issues for IE.

<h4>Credits</h4>

This extension is developed based on jquery social feed plugin by <a href="https://github.com/pavelk2/social-feed">Pavel Kucherbaev</a>
