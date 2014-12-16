Ext.define('NerdyKaraoke.view.TrackContainer', {
	extend: 'Ext.tab.Panel',
	xtype: 'TrackContainer',

	config: {
		tabBarPosition: 'bottom',
		tabBar: {
			hidden: true
		},
		items: [
			{
				xtype: 'TrackList',
				title: 'Tracks',
				tabIndex: 0
			},
			{
				xtype: 'TrackLyrics',
				title: 'Lyrics',
				tabIndex: 1
			}
		]
	}
});
