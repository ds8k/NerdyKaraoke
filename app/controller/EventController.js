Ext.define('NerdyKaraoke.controller.EventController', {
    extend: 'Ext.app.Controller',

    config: {
		refs: {
            Main: 'main',
            TrackContainer: 'TrackContainer',
            TrackList: 'TrackList',
            WhatsNew: 'WhatsNew',
            Category: 'Category',
            SearchField: 'searchfield[name=search]',
            SubmitRequest: 'button[action=submitRequest]',
            ContactMe: 'button[action=contactMe]',
            ViewTracks: 'button[action=viewTracks]',
            DataView: 'dataview[action=filter]',
            Changelog: 'button[text=Changelog]'
        },
        control: {
            SearchField: {
                keyup: 'searchTrackList',
                clearicontap: 'clearTrackList'
            },
            TrackList: {
            	itemtap: 'onTrackTap'
            },
            WhatsNew: {
                itemtap: 'onTrackTap'
            },
            Category: {
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
            },
            Changelog: {
                tap: 'showChangelog'
            }
        }
    },

    init: function() {
        NerdyKaraoke.app.controller = this;
    },

    searchTrackList: function(field, e) {
        console.log('searchTrackList', arguments);

        //If the enter key isn't pressed do nothing
    	if(e.event.keyCode != 13) {
            return;
        } else {
            var tabpanel = this.getTrackContainer(),
                trackList = this.getTrackList(),
                store = Ext.getStore('Karaoke'),
                value = field.getValue();

            field.blur();

            Ext.Viewport.mask({
                xtype: 'loadmask',
                message: ''
            });

            Ext.defer(function() {
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
                trackList.getScrollable().getScroller().scrollTo(0,0);
                trackList.refresh();

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
                    this.clearFilter(placeHolder);
                }

                //check if a value is set first, as if it isnt we dont have to do anything
                if (value) {
                    //the user could have entered spaces, so we must split them so we can loop through them all
                    var searches = value,
                        regexps, i;

                    //if found, create a new regular expression which is case insenstive
                    if(searches.toUpperCase() != 'THE WHO') {
                        searches = searches.replace(/^The /i, '');
                        searches = searches.trim();
                    }
                    if (searches.toUpperCase() === 'NSYNC') {
                        searches = 'N SYNC';
                    }

                    regexps = new RegExp(searches, 'i');

                    //now filter the store by passing a method
                    //the passed method will be called for each record in the store
                    store.filter(function(record) {
                        var matched = [],
                            blank = ' ',
                            search = regexps,
                            firstlast, justwords;

                        //loop through each of the regular expressions
                        firstlast = record.get('Artist').concat(blank,record.get('Title'));
                        justwords = record.get('Title').replace( /'/g, '');
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

                Ext.Viewport.unmask();
            }, 250, this);
        }
    },

    clearTrackList: function(field) {
        console.log('clearTrackList', arguments);

        var placeHolder = field.getPlaceHolder();
        var trackList = this.getTrackList();

    	//Reset the position of the list
        trackList.getScrollable().getScroller().scrollTo(0,0);
		trackList.refresh();

        //If the user was looking at lyrics, clear the HTML and set tab back to tracklist
        if(Ext.ComponentQuery.query('TrackContainer')[0].getActiveItem().title === 'Lyrics') {
            Ext.ComponentQuery.query('panel[name=lyricsbox]')[0].setHtml('');
        }

        //Remove the applied filter
        if(placeHolder === 'Search All Songs') {
            Ext.getStore('Karaoke').clearFilter();
        } else {
            placeHolder = placeHolder.slice(14);
            this.clearFilter(placeHolder);
        }
    },

    //presents the user with option to sign up for a song or view lyrics
    onTrackTap: function(list, index, target, record) {
        console.log('onTrackTap', arguments);

        var scope = this;

        Ext.Msg.show({
            title: record.data.Artist,
            message: record.data.Title,
            buttons: [
                {
                    itemId: 'cancel',
                    text: 'Cancel'
                },
                {
                    itemId: 'lyrics',
                    text: 'Lyrics',
                    ui: 'action'
                },
                {
                    itemId: 'signup',
                    text: 'Sign Up',
                    ui: 'action'
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
        console.log('onViewLyrics', arguments);

        //Set a load mask to prevent the user from dicking around too much before lyrics are done loading
        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: ''
        });

        //analytics
        ga('send', 'event', 'lyrics', 'tap', record.data.Artist + ' ' + record.data.Title);
    	var scope = this,
            tabpanel, lyrics, searchLyrics, backButton, page;

        switch(scope.getMain().getActiveItem().raw.title) {
            case 'Search':
                {
                    tabpanel = Ext.ComponentQuery.query('TrackContainer')[0];
                    lyrics = Ext.ComponentQuery.query('panel[name=lyricsbox]')[0];
                    searchLyrics = Ext.ComponentQuery.query('button[name=trackSearch]')[0];
                    backButton = Ext.ComponentQuery.query('button[name=trackBack]')[0];
                    page = 1;
                    break;
                }
            case 'What\'s New':
                {
                    tabpanel = Ext.ComponentQuery.query('WhatsNewContainer')[0];
                    lyrics = Ext.ComponentQuery.query('panel[name=newlyricsbox]')[0];
                    searchLyrics = Ext.ComponentQuery.query('button[name=newSearch]')[0];
                    backButton = Ext.ComponentQuery.query('button[name=newBack]')[0];
                    page = 0;
                    break;
                }
            default:
                {
                    tabpanel = Ext.ComponentQuery.query('CategoryContainer')[0];
                    lyrics = Ext.ComponentQuery.query('panel[name=categorylyricsbox]')[0];
                    searchLyrics = Ext.ComponentQuery.query('button[name=categorySearch]')[0];
                    backButton = Ext.ComponentQuery.query('button[name=categoryBack]')[0];
                    page = 0;
                    break;
                }
        }

        //Set the HTML for lyrics
        lyrics.setHtml(
            '<div class="lyricsFrame"><iframe id="lyrics" seamless sandbox="allow-same-origin allow-scripts" src="http://lyrics.wikia.com/' + 
            record.data.Artist + ':' + record.data.Title + '"></iframe></div>'
        );

        //Set lyrics tab as active view
    	tabpanel.setActiveItem(2);

        Ext.defer(function() {
            Ext.Viewport.unmask();
        }, 1000);

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
    },

    onSubmitRequest: function(button) {
        console.log('onSubmitRequest', arguments);

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

					            Ext.Msg.alert(
                                    'Hey!',
                                    'Thanks!',
                                    function() {
                                        form.setValues({
                                            title: ''
                                        });
                                    }
                                );
	        				}
        				}, 50);
        			}
        		);
            //Form is valid and we don't have the song - send request
            } else {
                form.submit();

                Ext.Msg.alert(
                    'Hey!',
                    'Thanks!',
                    function() {
                        form.setValues({
                            title: ''
                        });
                    }
                );
        	}

            localStorage.karaokeSubmitName = values.name;
            localStorage.karaokeSubmitEmail = values.email;
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
        console.log('onContactMe', arguments);

        document.location.href = 'mailto:darksonic8000@gmail.com?subject=Karaoke%20Issues';
    },

    //Called when user taps back button. Clears HTML and sets tracklist as main view
    onBackButton: function(page, tabpanel) {
        console.log('onBackButton', arguments);

        if(tabpanel.config.xtype === 'TrackContainer') Ext.ComponentQuery.query('panel[name=lyricsbox]')[0].setHtml('');
        if(tabpanel.config.xtype === 'WhatsNewContainer') Ext.ComponentQuery.query('panel[name=newlyricsbox]')[0].setHtml('');
        if(tabpanel.config.xtype === 'CategoryContainer') Ext.ComponentQuery.query('panel[name=categorylyricsbox]')[0].setHtml('');
        tabpanel.setActiveItem(page);
    },

    onViewTracks: function(button) {
        console.log('onViewTracks', arguments);

        var store = Ext.getStore('Karaoke');

        this.getSearchField().setPlaceHolder('Search All Songs');

        if(!store.isLoaded()) {
            store.load();
        }

        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: ''
        });

        Ext.defer(function() {
            store.clearFilter();
            this.getTrackContainer().setActiveItem(1);
            Ext.Viewport.unmask();
            ga('send', 'event', 'filter', 'tap', 'All Songs');
        }, 250, this);
    },

    onFilterTap: function(list, index, target, item) {
        console.log('onFilterTap', arguments);

        var store = Ext.getStore('Karaoke');

        if(item.data) {
            item = item.data.text;
        }

        if (item === '?') {
            if (store.isFiltered()) {
                this.getSearchField().setPlaceHolder('Search All Songs');
                store.clearFilter();
            }

            this.showRandomTrack(~~(Math.random() * store.getTotalCount()), store);
        } else {
            Ext.Viewport.mask({
                xtype: 'loadmask',
                message: ''
            });

            Ext.defer(function() {
                this.clearFilter(item);
                Ext.Viewport.unmask();
            }, 100, this);

            ga('send', 'event', 'filter', 'tap', 'By Artist');
        }
    },

    clearFilter: function(item) {
        console.log('clearFilter', arguments);

        var store = Ext.getStore('Karaoke'),
            trackList = this.getTrackList(),
            searchField = this.getSearchField();

        this.getTrackContainer().setActiveItem(1);
        trackList.getScrollable().getScroller().scrollTo(0,0);
        trackList.refresh();

        store.clearFilter();

        store.filter(function(record) {
            if(item === '0-9') {
                return !isNaN(record.get('Sort').charAt(0));
            } else {
                return item.toUpperCase() === record.get('Sort')[0];
            }
        });

        searchField.setValue('').setPlaceHolder('Search Within ' + item);
    },

    //Binary search function to check if we already have a requested song
    searchForMatchingTrack: function(storeData, index, value, totalCount) {
        console.log('searchForMatchingTrack', arguments);

        var tries = 10,
            downIndex = 0, 
            upIndex = totalCount, 
            i, matched;

        value.artist = value.artist.replace(/^The /i, '').toUpperCase();
        value.title = value.title.toUpperCase();

        //I use a number of tries method to get as close to the requested artist and song as possible
        while(tries > 0) {
            //If we don't have a match, the index needs to go up or down
            if(value.artist != storeData[index].data.Sort.toUpperCase() && value.title != storeData[index].data.Title.toUpperCase()) {
                //Artist is higher than the index. Move middle index up and down index to the previous middle
                if(value.artist > storeData[index].data.Sort.toUpperCase()) {
                    downIndex = index;
                    index = Math.round((upIndex - index)/2);
                //Artist is lower - Move down in the store. You get the idea
                } else if (value.artist < storeData[index].data.Sort.toUpperCase()) {
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
        if(value.artist > storeData[index].data.Sort.toUpperCase()) {
            for(i = index; !matched && i < upIndex; i++) {
                if(value.artist === storeData[i].data.Sort.toUpperCase() && value.title === storeData[i].data.Title.toUpperCase()) {
                    matched = storeData[i].data;
                }
            }
        //Requested artist is lower, move down the list
        } else if (value.artist < storeData[index].data.Sort.toUpperCase()) {
            for(i = index; !matched && i > downIndex; i--) {
                if(value.artist === storeData[i].data.Sort.toUpperCase() && value.title === storeData[i].data.Title.toUpperCase()) {
                    matched = storeData[i].data;
                }
            }
        //Artist is a match, we only have to check song titles
        } else {
            //Requested song title is higher up, go up
            if(value.title > storeData[index].data.Title.toUpperCase()) {
                for(i = index; !matched && i < upIndex; i++) {
                    if(value.artist === storeData[i].data.Sort.toUpperCase() && value.title === storeData[i].data.Title.toUpperCase()) {
                        matched = storeData[i].data;
                    }
                }
            //Request song title is lower, go down
            } else if(value.title < storeData[index].data.Title.toUpperCase()) {
                for(i = index; !matched && i > downIndex; i--) {
                    if(value.artist === storeData[i].data.Sort.toUpperCase() && value.title === storeData[i].data.Title.toUpperCase()) {
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
        console.log('showRandomTrack', arguments);

        var record = store.getAt(index);
        var song = record.getData();
        var scope = this;

        ga('send', 'event', 'view', 'tap', 'Random Song');

        Ext.Msg.show({
            title: 'A Random Song Appears!',
            message: 'Artist: ' + song.Artist + '<br />' + 'Title: ' + song.Title,
            buttons: [
                {
                    itemId: 'cancel',
                    text: 'Cancel'
                },
                {
                    itemId: 'lyrics',
                    text: 'Lyrics',
                    ui: 'action'
                },
                {
                    itemId: 'tryagain',
                    text: 'Try Again',
                    ui: 'action'
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
                                scope.onBackButton(0, scope.getTrackContainer());
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
        console.log('checkForKaraoke', arguments);

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
        console.log('onSignUpTap', arguments);

        var scope = this;

        Ext.Msg.prompt(
            record.data.Artist,
            record.data.Title,
            function(buttonText, value) {
                if (buttonText === 'ok') {
                    if (!value) {
                        Ext.defer(function() {
                            Ext.Msg.alert(
                                'Whoops!',
                                'You can\'t sign up without a name',
                                function() { scope.onSignUpTap(record); }
                            );
                        }, 50);
                    } else {
                        scope.signUpTapWithValue(value, record);
                    }
                }
            },
            this,
            false,
            localStorage.karaokeName ? localStorage.karaokeName : null,
            { placeHolder: 'What\'s your name?' }
        );
    },

    signUpTapWithValue: function(value, record) {
        console.log('signUpTapWithValue', arguments);

        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: ''
        });

        if (localStorage.karaokeName !== value) {
            localStorage.karaokeName = value;
        }

        var name = value + ' - ' + record.data.Artist + ' - ' + record.data.Title,
            date = new Date().toISOString(),
            apikey = '8bHe7yhb.kAGIWAxaS0FriAc61zW6uJQ';

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
                workspace: '28837322189586'
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
    },

    showChangelog: function() {
        console.log('showChangelog');

        Ext.Msg.alert(
            'Latest Changes',
            '<ul style="font-size:14px;line-height:1.5em;text-align:left;">' +
                '<li style="padding-top:0.5em">It\'s Disney night! Special Disney section</li>' +
            '</ul>'
        );
    }
});
