Ext.define('NerdyKaraoke.controller.EventController', {
    extend: 'Ext.app.Controller',

    config: {
		refs: {
            SearchTracks: 'searchfield[name=search]',
            LyricsTap: 'list[xtype=TrackList]'
        },
        control: {
            SearchTracks: {
                keyup: 'searchTrackList',
                clearicontap: 'clearTrackList'
            },
            LyricsTap: {
            	itemtap: 'onTrackTap'
            }
        }
    },

    searchTrackList: function(field, e) {
    	if(e.event.keyCode != 13) {
            return
        }

        Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
        Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();

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
                    var search = regexps[i];
                    firstlast = record.get('Artist').concat(blank,record.get('Title'));
                    justwords = record.get('Title').replace( /'/g, "" );
                    firstlast2 = record.get('Artist').concat(blank,justwords);
                    didMatch = record.get('Title').match(search) || record.get('Artist').replace(/\s+/g, '').match(search) || firstlast.match(search) || justwords.match(search) || firstlast2.match(search);

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
        }
    },

    clearTrackList: function() {
    	Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
		Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();
		Ext.getStore('Karaoke').clearFilter();
    },

    onTrackTap: function() {
    	Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
    }
});
