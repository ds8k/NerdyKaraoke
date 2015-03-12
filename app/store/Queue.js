Ext.define('NerdyKaraoke.store.Queue', {
    extend: 'Ext.data.Store',

    config: {
		autoLoad: true,
        fields: [
            'name'
        ],
        proxy: {
            noCache: true,
            enablePagingParams: false,
            type: 'ajax',
            url: 'https://app.asana.com/api/1.0/tasks?workspace=28837322189586&assignee=me',
            headers: {
                'Authorization': 'Basic ' + btoa('8bHe7yhb.kAGIWAxaS0FriAc61zW6uJQ' + ':')
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        },
        
	    listeners: {
	        load: {
	            fn: function(){
	                Ext.Viewport.unmask();
	            }
	        }
	    }
    }
});
