Ext.define('NerdyKaraoke.controller.EventController', {
    extend: 'Ext.app.Controller',

    config: {
		refs: {
            SearchTracks: 'searchfield[name=search]',
            LyricsItemTap: 'list[xtype=TrackList]',
            SubmitRequest: 'button[action=submitRequest]',
            ContactMe: 'button[action=contactMe]',
            BackButton: 'button[action=goBack]',
            ViewTracks: 'button[action=viewTracks]',
            DataView: 'dataview[action=filter]'
        },
        control: {
            SearchTracks: {
                keyup: 'searchTrackList',
                clearicontap: 'clearTrackList'
            },
            LyricsItemTap: {
            	itemtap: 'onTrackTap'
            },
            SubmitRequest: {
            	tap: 'onSubmitRequest'
            },
            ContactMe: {
                tap: 'onContactMe'
            },
            BackButton: {
                tap: 'onBackButton'
            },
            ViewTracks: {
                tap: 'onViewTracks'
            },
            DataView: {
                itemtap: 'onFilterTap'
            }
        }
    },

    searchTrackList: function(field, e) {
        //If the enter key isn't pressed do nothing
    	if(e.event.keyCode != 13) {
            return;
        } else {
            if(!field.getValue()) {
                Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(0);
                return;
            }
            //If looking at lyrics, clear HTML and set tracklist tab
            if(Ext.ComponentQuery.query('TrackContainer')[0].getActiveItem().title === 'Lyrics') {
                this.onBackButton();
            } else {
                Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
            }
            

            //Reset list position to top
            Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
            Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();

            var store = Ext.getStore('Karaoke');
            var value = field.getValue();

            //Clear any current filters on the store
            //store.clearFilter();

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

                field.setValue(value);
            }
        }
    },

    clearTrackList: function() {
    	//Reset the position of the list
        Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
		Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();

        //If the user was looking at lyrics, clear the HTML and set tab back to tracklist
        if(Ext.ComponentQuery.query('TrackContainer')[0].getActiveItem().title === 'Lyrics') {
            Ext.ComponentQuery.query('panel[name=lyricsbox]')[0].setHtml('');
        }

        var placeHolder = Ext.ComponentQuery.query('searchfield[name=search]')[0].getPlaceHolder();

        //Remove the applied filter
        if(placeHolder === 'Search All Songs') {
            Ext.getStore('Karaoke').clearFilter();
        } else {
            placeHolder = placeHolder.slice(14);
            this.onFilterTap(null, null, null, placeHolder);
        }
    },

    onTrackTap: function(list, index, target, record) {
        //Set a load mask to prevent the user from dicking around too much before lyrics are done loading
        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: ''
        });

    	var tabpanel = Ext.ComponentQuery.query('TrackContainer')[0];
    	var detailsTab = tabpanel.getInnerItems()[1];
        var searchLyrics = Ext.ComponentQuery.query('button[action=viewlyrics]')[0];

        //Set the HTML for lyrics
    	Ext.ComponentQuery.query('panel[name=lyricsbox]')[0].setHtml(
            '<div class="lyricsFrame"><iframe sandbox="allow-same-origin allow-scripts" src="http://lyrics.wikia.com/' + 
            record.data.Artist + ':' + record.data.Title + '"></iframe></div>'
    	);

        //Set lyrics tab as active view
    	tabpanel.setActiveItem(2);

        //Set the handler for the not found button in the event lyrics aren't available
        searchLyrics.setHandler(function() {
            window.open('https://www.google.com/search?q=' + record.data.Artist + ' ' + record.data.Title + ' lyrics', '_system');
        });

        //Set a 2 second timeout for loading the page
        setTimeout(function() {
            Ext.Viewport.unmask();
        }, 2000);

        setTimeout(function() {
            window.frames[0].stop();
        }, 3000);
    },

    onSubmitRequest: function(button) {
    	var form = button.up('formpanel');
        var models = Ext.create('NerdyKaraoke.model.RequestForm', form.getValues());
        var errors = models.validate();
        var store = Ext.getStore('Karaoke');
        var id;

        //Check to see if the form is filled out
        if(errors.isValid()) {
            //Find the middle point of the karaoke store
            var index = Math.round(store.getTotalCount()/2);

            //See if we have this damn song already
            id = this.searchForMatchingTrack(store.getData().all, index, form.getValues(), store.getTotalCount());

            //If we do, yell at the user
        	if (id) {
        		Ext.Msg.confirm(
        			'Whoops!', 
        			'We might have this already: </br>' + id.Artist + ' - ' + id.Title + '</br></br>Send request anyway?',
        			function(buttonText) {
        				Ext.defer(function() {
        					if(buttonText === 'yes') {
	        					form.submit();

					            Ext.Msg.confirm(
                                    'Thanks!',
                                    'Have more requests?',
                                    function(buttonText) {
                                        if(buttonText === 'yes') {
                                            form.setValues({
                                                artist: '',
                                                title: ''
                                            });
                                        } else { 
                                            form.reset();
                                        }
                                    }
                                );
	        				} else {
                                Ext.Msg.confirm(
                                    '',
                                    'Have more requests?',
                                    function(buttonText) {
                                        if(buttonText === 'yes') {
                                            form.setValues({
                                                artist: '',
                                                title: ''
                                            });
                                        } else { 
                                            form.reset();
                                        }
                                    }
                                );
                            }
        				}, 50);
        			}
        		);
            //Form is valid and we don't have the song - send request
        	} else {
	            form.submit();

                Ext.Msg.confirm(
                    'Thanks!',
                    'Have more requests?',
                    function(buttonText) {
                        if(buttonText === 'yes') {
                            form.setValues({
                                artist: '',
                                title: ''
                            });
                        } else { 
                            form.reset();
                        }
                    }
                );
        	}
        //Form isn't valid - yell at user
        } else {
            var message = '';

            Ext.each(errors.items, function(record, index) {
				message += record.getMessage() + '<br/>';
            });

            Ext.Msg.alert('Uh oh!', message);
        }
    },

    //Sends me an email. Self explanatory
    onContactMe: function(button) {
        document.location.href = 'mailto:darksonic8000@gmail.com?subject=Karaoke%20Issues';
    },

    //Called when user taps back button. Clears HTML and sets tracklist as main view
    onBackButton: function(button) {
        Ext.ComponentQuery.query('panel[name=lyricsbox]')[0].setHtml('');
        Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
    },

    onViewTracks: function(button) {
        Ext.ComponentQuery.query('searchfield[name=search]')[0].setPlaceHolder('Search All Songs');
        Ext.getStore('Karaoke').clearFilter();
        Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
    },

    onFilterTap: function(list, index, target, item) {
        var store = Ext.getStore('Karaoke');
        Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
        Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
        Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();

        if(item.data) {
            item = item.data.text;
        }

        store.clearFilter();

        store.filter(function(record) {
            if(item === '0-9') {
                return !isNaN(record.get('Artist').charAt(0));
            } else {
                return item === record.get('Artist').charAt(0);
            }
        });

        Ext.ComponentQuery.query('searchfield[name=search]')[0].setValue('');
        Ext.ComponentQuery.query('searchfield[name=search]')[0].setPlaceHolder('Search Within ' + item);
    },

    //Binary search function to check if we already have a requested song
    searchForMatchingTrack: function(storeData, index, value, totalCount) {
        var tries = 10,
            downIndex = 0, 
            upIndex = totalCount, 
            i, matched;

        //I use a number of tries method to get as close to the requested artist and song as possible
        while(tries > 0) {
            //If we don't have a match, the index needs to go up or down
            if(value.artist.toUpperCase() != storeData[index].raw.Artist.toUpperCase() && value.title.toUpperCase() != storeData[index].raw.Title.toUpperCase()) {
                //Artist is higher than the index. Move middle index up and down index to the previous middle
                if(value.artist.toUpperCase() > storeData[index].raw.Artist.toUpperCase()) {
                    downIndex = index;
                    index = Math.round((upIndex - index)/2);
                //Artist is lower - Move down in the store. You get the idea
                } else if (value.artist.toUpperCase() < storeData[index].raw.Artist.toUpperCase()) {
                    upIndex = index;
                    index = Math.round((index - downIndex)/2);
                //If we found the artist then don't waste time, get to checking song titles
                } else {
                    tries = 0;
                }
            //We found the artist and the song!
            } else {
                tries = 0;
            }

            //Decrement tries
            tries = tries-1;
        }

        //Now we start moving up or down one by one instead of cutting the list in half.
        //Requested artist is higher up in the list - move up incrementally
        if(value.artist.toUpperCase() > storeData[index].raw.Artist.toUpperCase()) {
            for(i = index; !matched && i < upIndex; i++) {
                if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                    matched = storeData[i].raw;
                }
            }
        //Requested artist is lower, move down the list
        } else if (value.artist.toUpperCase() < storeData[index].raw.Artist.toUpperCase()) {
            for(i = index; !matched && i > downIndex; i--) {
                if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                    matched = storeData[i].raw;
                }
            }
        //Artist is a match, we only have to check song titles
        } else {
            //Requested song title is higher up, go up
            if(value.title.toUpperCase() > storeData[index].raw.Title.toUpperCase()) {
                for(i = index; !matched && i < upIndex; i++) {
                    if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                        matched = storeData[i].raw;
                    }
                }
            //Request song title is lower, go down
            } else if(value.title.toUpperCase() < storeData[index].raw.Title.toUpperCase()) {
                for(i = index; !matched && i > downIndex; i--) {
                    if(value.artist.toUpperCase() === storeData[i].raw.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].raw.Title.toUpperCase()) {
                        matched = storeData[i].raw;
                    }
                }
            //We found the artist and the song
            } else {
                matched = storeData[index].raw;
            }
        }

        //Return what we found
        return matched;
    }
});
