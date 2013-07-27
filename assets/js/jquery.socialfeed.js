if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {
        }
        ;
        F.prototype = obj;
        return new F();
    };
}
;
(function($, window, document, undefined) {
    /*var socialFeed = {
     };
     
     $.fn.socialfeed = function( options ) {
            return this.each(function() {
                var feed = Object.create( socialFeed );
                
                feed( options, this );
     
                $.data( this, 'socialfeed', feed );
            });
        };*/
    $.fn.socialfeed = function(options)
    {
        var defaults = {
            plugin_folder: '', // a folder in which the plugin is located (with a slash in the end)
            template: 'template.html', // a path to the tamplate file
            show_media: false, //show images of attachments if available
            // VK.com
            vk_limit: 3, // amount of vkontakte posts to show
            vk_source: 'owner',
            //vk_username: "vk_username", // ID of a VK page which stream will be shown  
            // Twitter.com
            tw_limit: 3, // amount of twitter posts to show
            //tw_username: "tw_username", // ID of a twitter page which stream will be shown  
            // Facebook.com
            fb_limit: 3, // amount of facebook posts to show
            //fb_token: 'YOUR_FACEBOOK_APPLICATION_ACCESS_TOKEN',
            //fb_username: "fb_username", // ID of a Facebook page which stream will be shown
            // General
            cookies: false, //if true then twitter results will be saved in cookies, to fetch them if 150 requests/hour is over.
            //currently works only for saving sets of tweets under 10
            length: 500 // maximum length of post message shown
        };
        //---------------------------------------------------------------------------------
        var options = $.extend(defaults, options), container = $(this), template;
        container.empty().css('display', 'inline-block');
        //---------------------------------------------------------------------------------
        // Initiate function
        return getAllData();
        //---------------------------------------------------------------------------------
        //This function performs consequent data loading from all of the sources by calling corresponding functions
        function getAllData() {
            if (options.fb_username != undefined) {
                //Facebook requires an access_token for fetching the feed.
                getFacebookData(options.fb_token);
            }
          
        }
        function getFacebookData(access_token) {
            var limit = 'limit=' + options.fb_limit,
                    query_extention = '&access_token=' + access_token + '&callback=?',
                    fb_graph = 'https://graph.facebook.com/',
                    feed_json = fb_graph + options.fb_username + '/feed?' + limit + query_extention;
            $.get(feed_json, function(json) {
                $.each(json.data, function() {
                    var element = this,
                            post = {};
                    if (element.message != undefined || element.story != undefined) {
                        var text = element.story,
                                url = 'http://facebook.com/' + element.from.id
                        if (element.message != undefined)
                            text = element.message;
                        if (element.link != undefined)
                            url = element.link;
                        if (options.show_media) {
                            if (element.picture) {

                                post.attachment = '<img class="attachment" src="' + element.picture.replace('_s.', '_b.') + '" />';
                            }
                        }

                        post.dt_create = moment(element.created_time);//dateToSeconds(convertDate(element.created_time));
                        post.author_link = 'http://facebook.com/' + element.from.id;
                        post.author_picture = fb_graph + element.from.id + '/picture';
                        post.post_url = url;
                        post.author_name = element.from.name;
                        post.message = text;
                        post.description = (element.description != undefined) ? element.description : '';
                        post.link = url;
                        post.social_network = 'fb';
                        getTemplate(post);
                    }
                });
            }, 'json');

        }

    
        //---------------------------------------------------------------------------------
        //Render functions
        //---------------------------------------------------------------------------------
        function getTemplate(data) {
            var content = data;
            content.attachment = (content.attachment == undefined) ? '' : content.attachment;
            content.time_ago = data.dt_create.fromNow();
            content.dt_create = content.dt_create.valueOf();
            content.text = wrapLinks(shorten(data.message + ' ' + data.description), data.social_network);
            content.social_icon = options.plugin_folder + 'img/' + data.social_network + '-icon-24.png';
            if (template != undefined)
                placeTemplate(template(content), data);
            else
                $.get(options.template, function(template_html) {
                    template = doT.template(template_html);
                    placeTemplate(template(content), data);
                });

        }
        function placeTemplate(template, data) {
            if ($(container).children().length == 0) {
                $(container).append(template);
            } else {
                var i = 0,
                        insert_index = -1;
                $.each($(container).children(), function() {
                    if ($(this).attr('dt_create') < data.dt_create) {
                        insert_index = i;
                        return false;
                    }
                    i++;
                });
                $(container).append(template);
                if (insert_index >= 0) {
                    insert_index++;
                    var before = $(container).children('div:nth-child(' + insert_index + ')'),
                            current = $(container).children('div:last-child');
                    $(current).insertBefore(before);
                }
                else {
                }

            }
        }
        //---------------------------------------------------------------------------------
        //Utility functions
        //---------------------------------------------------------------------------------
        function wrapLinks(string, social_network) {
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            string = string.replace(exp, wrapLinkTemplate);
            if (social_network == 'tw') {
                string = string.replace(/(@|#)([a-z0-9_]+)/ig, wrapTwitterTagTemplate);
            }
            return string;
        }
        function wrapLinkTemplate(string) {
            return '<a target="_blank" href="' + string + '">' + string + '<\/a>';
        }
        //---------------------------------------------------------------------------------
        function wrapTwitterTagTemplate(string) {
            return '<a target="_blank" href="http://twitter.com/' + string + '" >' + string + '<\/a>';
        }
        //---------------------------------------------------------------------------------
        function fixTwitterDate(created_at) {
            created_at = created_at.replace('+0000', 'Z');
            if (created_at !== undefined)
                return created_at;
        }
        function shorten(string) {
            string = $.trim(string);
            if (string.length > options.length)
            {
                var cut = string.substring(0, options.length),
                        link_start_position = cut.lastIndexOf('http');
                if (link_start_position > 0) {
                    var link_end_position = string.indexOf(' ', link_start_position);
                    if (link_end_position > options.length && string != string.substring(0, link_end_position))
                        return string.substring(0, link_end_position) + " ..";
                    else
                        return string;
                } else {
                    return cut + "..";
                }
            } else
                return string;
        }
        function stripHTML(string) {
            if (typeof string === "undefined" || string === null)
                return '';
            return string.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig, "");
        }
        //---------------------------------------------------------------------------------
    };

})(jQuery);
