Ext.define('NerdyKaraoke.store.Category', {
    extend: 'Ext.data.Store',

    config: {
        autoLoad: true,
        model: 'NerdyKaraoke.model.Songs',
        sorters: 'Title',
        proxy: {
            type: 'ajax',
            url: 'category.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke'
            }
        },
        grouper: {
            groupFn: function(record) {
                return record.data.Artist;
            },
            sortProperty: 'Sort'
        },
        listeners: {
            load: {
                fn: function() {
                    Ext.Viewport.unmask();
                }
            }
        }
    }
});
