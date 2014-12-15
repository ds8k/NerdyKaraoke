Ext.define('NerdyKaraoke.view.Main', {
 extend: 'Ext.ux.slidenavigation.View',

    xtype: 'main',
    requires: [
        'Ext.Container',
        'Ext.MessageBox',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.event.publisher.Dom',
        'Ext.field.Search',
        'Ext.field.Email',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.Button',
        'NerdyKaraoke.store.Karaoke'
    ],
    
    config: {
        fullscreen: true,
        slideSelector: 'x-toolbar',
        containerSlideDelay: 10,
        selectSlideDuration: 200,
        itemMask: true,
        slideButtonDefaults: {
            selector: 'toolbar'
        },
        list: {
            maxDrag: 400,
            width: 200,
            items: {
                xtype: 'toolbar',
                docked: 'top',
                minHeight: '50px',
                title: {
                    title: 'Navigation',
                    centered: false,
                    width: 200,
                    left: 0
                }
            }
        },
        
        listPosition: 'left',
        defaults: {
            xtype: 'container'
        },
        
        items: [{
            title: 'Track List',

            slideButton: true,
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    minHeight: '50px',
                    items: [
                        {
                            centered: true,
                            xtype: 'searchfield',
                            placeHolder: 'Search Track List',
                            listeners: {
                                keyup: {
                                    fn: function(field, e) 
                                    {
                                        if(e.event.keyCode != 13) {
                                            return
                                        }

                                        Ext.Viewport.mask({
                                            xtype: 'loadmask',
                                            message: ''
                                        });

                                        var store = Ext.getStore('Karaoke');
                                        var value = field.getValue();

                                        //first clear any current filters on thes tore
                                        store.clearFilter();

                                        //check if a value is set first, as if it isnt we dont have to do anything
                                        if (value) {
                                            //the user could have entered spaces, so we must split them so we can loop through them all
                                            var searches = [value]
                                            // var searches = value.split(' ');
                                            // searches[searches.length] = value;

                                            var regexps = [];
                                            var i;
                                            console.log(searches);
                                            //loop them all
                                            for (i = 0; i < searches.length; i++) {
                                                //if it is nothing, continue
                                                if (!searches[i]) continue;

                                                //if found, create a new regular expression which is case insenstive
                                                if(searches[i].toUpperCase() != 'THE WHO') {
                                                    searches[i] = searches[i].replace(/^The/i, '');
                                                    searches[i] = searches[i].trim();
                                                }
                                                if (searches[i].toUpperCase() === 'NSYNC') {
                                                    searches[i] = 'N SYNC';
                                                }

                                                regexps.push(new RegExp(searches[i], 'i'));
                                            }

                                            //now filter the store by passing a method
                                            //the passed method will be called for each record in the store
                                            store.filter(function(record) {
                                                var matched = [];
                                                var blank = ' ';
                                                var firstlast;
                                                var justwords;

                                                //loop through each of the regular expressions
                                                for (i = 0; i < regexps.length; i++) {
                                                    var search = regexps[i],
                                                    firstlast = record.get('Artist').concat(blank,record.get('Title'));
                                                    justwords = record.get('Title').replace( /'/g, "" );
                                                    firstlast2 = record.get('Artist').concat(blank,justwords);
                                                    didMatch = record.get('Title').match(search) || record.get('Artist').match(search) || firstlast.match(search) || justwords.match(search) || firstlast2.match(search);

                                                    //if it matched the first or last name, push it into the matches array
                                                    matched.push(didMatch);
                                                }
                                                //if nothing was found, return false (dont so in the store)
                                                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                                                    return false;
                                                } else {
                                                    //else true true (show in the store)
                                                    return matched[0];
                                                } 
                                            });

                                        Ext.Viewport.unmask();
                                        }
                                    }
                                },

                                clearicontap: {
                                    fn: function(){
                                        Ext.Viewport.mask({
                                            xtype: 'loadmask',
                                            message: ''
                                        });

                                        Ext.getStore('Karaoke').clearFilter();

                                        Ext.Viewport.unmask();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'Tracks'
                }
            ]
        },
        {
            title: 'What\'s New',
            slideButton: true,

            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    minHeight: '50px',
                    title: 'What\'s New'
                },
                {
                    xtype: 'WhatsNew'
                }
            ]
        },
        {
            title: 'Send A Request',
            slideButton: true,
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    minHeight: '50px',
                    title: 'Send A Request'
                },
                {
                    xtype: 'Submit'
                }
            ]
        }]
    }
});