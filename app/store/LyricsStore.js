Ext.define('NerdyKaraoke.store.LyricsStore', {
    extend: 'Ext.data.Store',

    config: {
    	autoLoad: true,
    	fields: [
    		'artist',
    		'song',
    		'lyrics',
    		'url'
    	],
    	proxy: {
    		type: 'ajax',
    		noCache: false,
    		headers: {
    			'X-Wikia-API-Key': '6272b2dd183729263dcfd28816537be564787b53'
    		},
    		url: 'http://lyrics.wikia.com/api.php?func=getSong&artist=null&song=null&fmt=json',
    		enablePagingParams: false,
    		reader: {
    			type: 'json'
    		}
    	}
    },

    getBaseUrl: function() {
        return 'http://lyrics.wikia.com/api.php?func=getSong&artist='
    }
});
