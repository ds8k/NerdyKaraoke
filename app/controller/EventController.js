Ext.define('NerdyKaraoke.controller.EventController', {
    extend: 'Ext.app.Controller',

    config: {
		refs: {
            SearchTracks: 'searchfield[name=search]',
            // LyricsItemTap: 'list[xtype=TrackList]',
            // ViewLyrics: 'button[action=viewlyrics]',
            SubmitRequest: 'button[action=submitRequest]'
        },
        control: {
            SearchTracks: {
                keyup: 'searchTrackList',
                clearicontap: 'clearTrackList'
            },
            // LyricsItemTap: {
            // 	itemtap: 'onTrackTap'
            // },
            // ViewLyrics: {
            // 	tap: 'onViewLyricsTap'
            // },
            SubmitRequest: {
            	tap: 'onSubmitRequest'
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
		Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(0);
		Ext.getStore('Karaoke').clearFilter();
    },

    onTrackTap: function(list, index, target, record) {
    	var store = Ext.getStore('LyricsStore').getData().items[0].raw;
    	var tabpanel = Ext.ComponentQuery.query('TrackContainer')[0];
    	var detailsTab = tabpanel.getInnerItems()[1];
    	var button = Ext.ComponentQuery.query('button[action=viewlyrics]')[0];
        console.log('yo');
        this.setLyricUrl(Ext.getStore('LyricsStore'), record);

    	detailsTab.down('container').setHtml(
    		'<h3>' + record.data.Artist + '</br>' + record.data.Title + '</h3>' + 
    		store.lyrics.replace(/\n/g, '</br>')
    	);

    	tabpanel.setActiveItem(1);

    	if(store.lyrics.toUpperCase() != 'NOT FOUND') {
    		button.setText('View Full Lyrics');
    	} else {
    		button.setText('Search Lyrics');
    	}
    },

    onViewLyricsTap: function(button) {
    	var store = Ext.getStore('LyricsStore').getData().items[0].raw;
        var record = button.up('container').getRecord();

    	if(store.lyrics.toUpperCase() != 'NOT FOUND') {
    		window.location(store.url);
    	} else {
    		window.open('https://www.google.com/search?q=' + store.artist + ' ' + store.song + ' lyrics', '_system');
    	}
    },

    onSubmitRequest: function(button) {
    	var form = button.up('formpanel');
        var models = Ext.create('NerdyKaraoke.model.RequestForm', form.getValues());
        var errors = models.validate();
        var store = Ext.getStore('Karaoke');
        var id;

        if(errors.isValid()) {
            var index = Math.round(store.getTotalCount()/2);
            id = this.searchForMatchingTrack(store.getData().all, index, form.getValues(), store.getTotalCount());

        	if (id) {
        		Ext.Msg.confirm(
        			'Whoops!', 
        			'We might have this already: </br>' + id.Artist + ' - ' + id.Title + '</br></br>Send request anyway?',
        			function(buttonText) {
        				Ext.defer(function() {
        					if(buttonText === 'yes') {
	        					form.submit();
					            Ext.Msg.alert('Thanks!');
					            form.reset();
	        				}
        				}, 50);
        			}
        		);
        	} else {
	            form.submit();
	            Ext.Msg.alert('Thanks!');
	            form.reset();
        	}
        } else {
            var message = '';

            Ext.each(errors.items, function(record, index) {
				message += record.getMessage() + '<br/>';
            });

            Ext.Msg.alert('Uh oh!', message);
        }
    },

    searchForMatchingTrack: function(storeData, index, value, totalCount) {
        var tries = 10,
            downIndex = 0, 
            upIndex = totalCount, 
            i, matched;

        while(tries > 0) {
            if(value.artist.toUpperCase() != storeData[index].raw.Artist.toUpperCase() && value.title.toUpperCase() != storeData[index].raw.Title.toUpperCase()) {
                if(value.artist.toUpperCase() > storeData[index].raw.Artist.toUpperCase()) {
                    downIndex = index;
                    index = Math.round((upIndex - index)/2);
                } else if (value.artist.toUpperCase() < storeData[index].raw.Artist.toUpperCase()) {
                    upIndex = index;
                    index = Math.round((index - downIndex)/2);
                } else {
                    tries = 0;
                }
            } else {
                tries = 0;
            }

            tries = tries-1;
        }

        if(value.artist.toUpperCase() > storeData[index].raw.Artist.toUpperCase()) {
            for(i = index; !matched && i < upIndex; i++) {
                if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                    matched = storeData[i].raw;
                }
            }
        } else if (value.artist.toUpperCase() < storeData[index].raw.Artist.toUpperCase()) {
            for(i = index; !matched && i > downIndex; i--) {
                if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                    matched = storeData[i].raw;
                }
            }
        } else {
            if(value.title.toUpperCase() > storeData[index].raw.Title.toUpperCase()) {
                for(i = index; !matched && i < upIndex; i++) {
                    if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                        matched = storeData[i].raw;
                    }
                }
            } else if(value.title.toUpperCase() < storeData[index].raw.Title.toUpperCase()) {
                for(i = index; !matched && i > downIndex; i--) {
                    if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                        matched = storeData[i].raw;
                    }
                }
            } else {
                matched = storeData[index].raw;
            }
        }
        return matched;
    },

    setLyricUrl: function(store, record) {
        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: ''
        });

        store.getProxy().setUrl(store.getBaseUrl() + record.data.Artist + '&song=' + record.data.Title + '&fmt=json');
        console.log(store.getProxy().getUrl());
        store.load();
        store.on('load', function() {
            Ext.Viewport.unmask();
        });
    }
});
