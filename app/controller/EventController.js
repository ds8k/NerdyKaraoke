Ext.define('NerdyKaraoke.controller.EventController', {
    extend: 'Ext.app.Controller',

    config: {
		refs: {
            SearchTracks: 'searchfield[name=search]',
            TrackItemTap: 'list[xtype=TrackList]',
            NewItemTap: 'list[xtype=WhatsNew]',
            SubmitRequest: 'button[action=submitRequest]',
            ContactMe: 'button[action=contactMe]',
            ViewTracks: 'button[action=viewTracks]',
            DataView: 'dataview[action=filter]'
        },
        control: {
            SearchTracks: {
                keyup: 'searchTrackList',
                clearicontap: 'clearTrackList'
            },
            TrackItemTap: {
            	itemtap: 'onTrackTap'
            },
            NewItemTap: {
                itemtap: 'onTrackTap'
            },
            SubmitRequest: {
            	tap: 'onSubmitRequest'
            },
            ContactMe: {
                tap: 'onContactMe'
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
            var tabpanel = Ext.ComponentQuery.query('TrackContainer')[0];
            //if the field is empty and the person hits enter then go back to letter selection
            if(!field.getValue()) {
                tabpanel.setActiveItem(0);
                return;
            }
            //If looking at lyrics, clear HTML and set tracklist tab, else set the view to tracklist
            if(tabpanel.getActiveItem().title === 'Lyrics') {
                this.onBackButton(1, tabpanel);
            } else {
                tabpanel.setActiveItem(1);
            }
            

            //Reset list position to top
            Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
            Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();

            var store = Ext.getStore('Karaoke');
            var value = field.getValue();

            //analytics
            ga('send', 'event', 'search', 'enter', field.getValue());

            //if the store isn't loaded then load it
            if(!store.isLoaded()) {
                store.load();
            }

            //Clear any current filters on the store
            var placeHolder = Ext.ComponentQuery.query('searchfield[name=search]')[0].getPlaceHolder();

            if(placeHolder === 'Search All Songs') {
                store.clearFilter();
            } else {
                placeHolder = placeHolder.slice(14);
                this.onFilterTap(null, null, null, placeHolder);
            }

            //check if a value is set first, as if it isnt we dont have to do anything
            if (value) {
                //the user could have entered spaces, so we must split them so we can loop through them all
                var searches = value,
                    regexps, i;

                //if found, create a new regular expression which is case insenstive
                if(searches.toUpperCase() != 'THE WHO') {
                    searches = searches.replace(/^The/i, '');
                    searches = searches.trim();
                }
                if (searches.toUpperCase() === 'NSYNC') {
                    searches = 'N SYNC';
                }

                regexps = new RegExp(searches, 'i');

                //now filter the store by passing a method
                //the passed method will be called for each record in the store
                store.filter(function(record) {
                    var matched = [];
                    var blank = ' ';
                    var firstlast;
                    var justwords;

                    //loop through each of the regular expressions
                    var search = regexps;
                    firstlast = record.get('Artist').concat(blank,record.get('Title'));
                    justwords = record.get('Title').replace( /'/g, "" );
                    firstlast2 = record.get('Artist').concat(blank,justwords);
                    didMatch = record.get('Title').match(search) || record.get('Artist').replace(/\s+/g, '').match(search) || firstlast.match(search) || justwords.match(search) || firstlast2.match(search);

                    //if it matched the first or last name, push it into the matches array
                    matched = didMatch;

                    //if nothing was found, return false (dont so in the store)
                    if (!didMatch) {
                        return false;
                    } else {
                        return matched;
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

    //presents the user with option to sign up for a song or view lyrics
    onTrackTap: function(list, index, target, record) {
        var scope = this;

        Ext.Msg.show({
            title: record.data.Artist,
            message: record.data.Title,
            buttons: [
                {
                    itemId: 'signup',
                    text: 'Sign Up',
                    ui: 'action'
                },
                {
                    itemId: 'lyrics',
                    text: 'View Lyrics',
                    ui: 'action'
                },
                {
                    itemId: 'cancel',
                    text: 'Cancel'
                }
            ],
            prompt: false,
            fn: function(buttonText, btn) {
                if (buttonText === 'signup') {
                    Ext.defer(function() {
                        scope.checkForKaraoke(record);
                    }, 50);
                } else if (buttonText === 'lyrics') {
                    scope.onViewLyrics(record);
                }
            }
        });
    },

    onViewLyrics: function(record) {
        //Set a load mask to prevent the user from dicking around too much before lyrics are done loading
        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: ''
        });

        //analytics
        ga('send', 'event', 'lyrics', 'tap', record.data.Artist + ' ' + record.data.Title);
    	var tabpanel = record.data.addNew ? Ext.ComponentQuery.query('WhatsNewContainer')[0] : Ext.ComponentQuery.query('TrackContainer')[0],
            scope = this,
            lyrics, searchLyrics, backButton, page;

        if(tabpanel.config.xtype === 'TrackContainer') {
            lyrics = Ext.ComponentQuery.query('panel[name=lyricsbox]')[0];
            searchLyrics = Ext.ComponentQuery.query('button[name=trackSearch]')[0];
            backButton = Ext.ComponentQuery.query('button[name=trackBack]')[0];
            page = 1;
        } else {
            lyrics = Ext.ComponentQuery.query('panel[name=newlyricsbox]')[0];
            searchLyrics = Ext.ComponentQuery.query('button[name=newSearch]')[0];
            backButton = Ext.ComponentQuery.query('button[name=newBack]')[0];
            page = 0;
        }

        //Set the HTML for lyrics
        lyrics.setHtml(
            '<div class="lyricsFrame"><iframe id="lyrics" seamless sandbox="allow-same-origin allow-scripts" src="http://lyrics.wikia.com/' + 
            record.data.Artist + ':' + record.data.Title + '"></iframe></div>'
        );

        document.getElementById("lyrics").onload = function() {
            Ext.Viewport.unmask();
        };

        //Set lyrics tab as active view
    	tabpanel.setActiveItem(2);

        //Set the handler for the not found button in the event lyrics aren't available
        searchLyrics.setHandler(function() {
            window.open('https://www.google.com/search?q=' + record.data.Artist + ' ' + record.data.Title + ' lyrics', '_system');
            ga('send', 'event', 'lyrics not found', 'tap', record.data.Artist + ' ' + record.data.Title);
        });

        if (!backButton.hasListener('tap')) {
            backButton.on(
                'tap',
                function() {
                    scope.onBackButton(page, tabpanel);
                }, 
                scope,
                { single: true }
            );
        }

        //Set a 2 second timeout for loading the page
        setTimeout(function() {
            Ext.Viewport.unmask();
        }, 10000);
    },

    onSubmitRequest: function(button) {
    	var form = button.up('formpanel');
        var values = form.getValues();
        var models = Ext.create('NerdyKaraoke.model.RequestForm', values);
        var errors = models.validate();
        var store = Ext.getStore('Karaoke');
        var id, request, match;

        //Check to see if the form is filled out
        if(errors.isValid()) {
            //Find the middle point of the karaoke store
            var index = Math.round(store.getTotalCount()/2);

            //See if we have this damn song already
            id = this.searchForMatchingTrack(store.getData().all, index, values, store.getTotalCount());

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
                form. submit();

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
    onBackButton: function(page, tabpanel) {
        if(tabpanel.config.xtype === 'TrackContainer') {
            Ext.ComponentQuery.query('panel[name=lyricsbox]')[0].setHtml('');
        } else {
            Ext.ComponentQuery.query('panel[name=newlyricsbox]')[0].setHtml('');
        }
        tabpanel.setActiveItem(page);
    },

    onViewTracks: function(button) {
        var store = Ext.getStore('Karaoke');
        Ext.ComponentQuery.query('searchfield[name=search]')[0].setPlaceHolder('Search All Songs');
        if(!store.isLoaded()) {
            store.load();
        }
        store.clearFilter();
        Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
        ga('send', 'event', 'filter', 'tap', 'All Songs');
    },

    onFilterTap: function(list, index, target, item) {
        var store = Ext.getStore('Karaoke');

        if(item.data) {
            item = item.data.text;
        }

        if (item !== '?') {
            Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(1);
            Ext.ComponentQuery.query('list[xtype=TrackList]')[0].getScrollable().getScroller().scrollTo(0,0);
            Ext.ComponentQuery.query('list[xtype=TrackList]')[0].refresh();

            if(!store.isLoaded()) {
                store.load();
            }

            store.clearFilter();

            store.filter(function(record) {
                if(item === '0-9') {
                    return !isNaN(record.get('Artist').charAt(0));
                } else {

                    return item.toUpperCase() === record.get('Artist').charAt(0).toUpperCase();
                }
            });

            Ext.ComponentQuery.query('searchfield[name=search]')[0].setValue('');
            Ext.ComponentQuery.query('searchfield[name=search]')[0].setPlaceHolder('Search Within ' + item);
            ga('send', 'event', 'filter', 'tap', 'By Artist');
        } else {
            if (store.isFiltered()) {
                store.clearFilter();
                Ext.ComponentQuery.query('searchfield[name=search]')[0].setPlaceHolder('Search All Songs');
            }

            this.showRandomTrack(~~(Math.random() * store.getTotalCount()), store);
        }
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
            if(value.artist.toUpperCase() != storeData[index].data.Artist.toUpperCase() && value.title.toUpperCase() != storeData[index].data.Title.toUpperCase()) {
                //Artist is higher than the index. Move middle index up and down index to the previous middle
                if(value.artist.toUpperCase() > storeData[index].data.Artist.toUpperCase()) {
                    downIndex = index;
                    index = Math.round((upIndex - index)/2);
                //Artist is lower - Move down in the store. You get the idea
                } else if (value.artist.toUpperCase() < storeData[index].data.Artist.toUpperCase()) {
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
        if(value.artist.toUpperCase() > storeData[index].data.Artist.toUpperCase()) {
            for(i = index; !matched && i < upIndex; i++) {
                if(value.artist.toUpperCase() === storeData[i].data.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].data.Title.toUpperCase()) {
                    matched = storeData[i].data;
                }
            }
        //Requested artist is lower, move down the list
        } else if (value.artist.toUpperCase() < storeData[index].data.Artist.toUpperCase()) {
            for(i = index; !matched && i > downIndex; i--) {
                if(value.artist.toUpperCase() === storeData[i].data.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].data.Title.toUpperCase()) {
                    matched = storeData[i].data;
                }
            }
        //Artist is a match, we only have to check song titles
        } else {
            //Requested song title is higher up, go up
            if(value.title.toUpperCase() > storeData[index].data.Title.toUpperCase()) {
                for(i = index; !matched && i < upIndex; i++) {
                    if(value.artist.toUpperCase() === storeData[i].data.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].data.Title.toUpperCase()) {
                        matched = storeData[i].data;
                    }
                }
            //Request song title is lower, go down
            } else if(value.title.toUpperCase() < storeData[index].data.Title.toUpperCase()) {
                for(i = index; !matched && i > downIndex; i--) {
                    if(value.artist.toUpperCase() === storeData[i].data.Artist.toUpperCase() && value.title.toUpperCase() === storeData[i].data.Title.toUpperCase()) {
                        matched = storeData[i].data;
                    }
                }
            //We found the artist and the song
            } else {
                matched = storeData[index].data;
            }
        }

        //Return what we found
        return matched;
    },

    showRandomTrack: function(index, store) {
        var record = store.getAt(index);
        var song = record.getData();
        var scope = this;

        ga('send', 'event', 'view', 'tap', 'Random Song');

        Ext.Msg.show({
            title: 'A Random Song Appears!',
            message: 'Artist: ' + song.Artist + '<br />' + 'Title: ' + song.Title,
            buttons: [
                {
                    itemId: 'tryagain',
                    text: 'Try Again',
                    ui: 'action'
                },
                {
                    itemId: 'lyrics',
                    text: 'View Lyrics',
                    ui: 'action'
                },
                {
                    itemId: 'cancel',
                    text: 'Cancel'
                }
            ],
            prompt: false,
            fn: function(buttonText, btn) {
                Ext.defer(function() {
                    if (buttonText === 'tryagain') {
                        scope.showRandomTrack(~~(Math.random() * store.getTotalCount()), store);
                    }
                    if (buttonText === 'lyrics') {
                        Ext.ComponentQuery.query('button[name=trackBack]')[0].on(
                            'tap',
                            function() {
                                scope.onBackButton(0, Ext.ComponentQuery.query('TrackContainer')[0]);
                            }, 
                            scope,
                            { single: true }
                        );

                        scope.onViewLyrics(record);
                    }
                }, 50);
            }
        });
    },

    checkForKaraoke: function(record) {
        var scope = this;

        Ext.Ajax.request({
            url: 'control/isKaraoke.json',
            method: 'GET',
            success: function(response) {
                responseText = Ext.JSON.decode(response.responseText);

                if(responseText) {
                    scope.onSignUpTap(record);
                } else {
                    Ext.Msg.alert(
                        'Whoops!',
                        'Karaoke is closed for business!'
                    );
                }
            }
        });
    },

    onSignUpTap: function(record) {
        var scope = this;
        var apikey = '';
        
        Ext.Msg.prompt(
            record.data.Artist,
            record.data.Title,
            function(buttonText, value) {
                if (buttonText === 'ok') {
                    if(value.indexOf('-') !== -1 || value.indexOf('>') !== -1 || value.indexOf('<') !== -1) {
                        localStorage.removeItem('karaokeName');
                        Ext.defer(function() {
                            Ext.Msg.alert(
                                'Whoops!',
                                'No special characters.<br>Please try again!',
                                function() { scope.onSignUpTap(record); }
                            );
                        }, 50);
                    } else if (value) {
                        Ext.Viewport.mask({
                            xtype: 'loadmask',
                            message: ''
                        });

                        if (localStorage.karaokeName !== value) {
                            localStorage.karaokeName = value;
                        }

                        var name = value + ' - ' + record.data.Artist + ' - ' + record.data.Title;
                        var date = new Date().toISOString();

                        Ext.Ajax.request({
                            method: 'POST',
                            url: 'https://app.asana.com/api/1.0/tasks',
                            headers: {
                                'Authorization': 'Basic ' + btoa(apikey + ':')
                            },
                            params: {
                                name: name,
                                due_at: date,
                                assignee: 'me',
                                workspace: ''
                            },
                            success: function(response) {
                                ga('send', 'event', 'sign up', 'enter', value);

                                Ext.defer(function() {
                                    Ext.Msg.alert(
                                        'Success',
                                        'You signed up to sing!'
                                    );
                                }, 50);
                            },
                            failure: function() {
                                Ext.defer(function() {
                                    Ext.Msg.alert(
                                        'Uh oh',
                                        'Something bad happened. Try again or sign up manually.'
                                    );
                                }, 50);
                            },
                            callback: function() {
                                Ext.Viewport.unmask();
                            }
                        });
                    } else if (!value) {
                        Ext.defer(function() {
                            Ext.Msg.alert(
                                'Whoops!',
                                'You can\'t sign up without a name',
                                function() { scope.onSignUpTap(record); }
                            );
                        }, 50);
                    }
                }
            },
            this,
            false,
            localStorage.karaokeName ? localStorage.karaokeName : null,
            { placeHolder: 'What\'s your name?' }
        );
    }
});
