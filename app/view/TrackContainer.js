Ext.define('NerdyKaraoke.view.TrackContainer', {
	extend: 'Ext.tab.Panel',
	xtype: 'TrackContainer',
	requires: ['Ext.ux.touch.SwipeTabs'],

	config: {
		plugins: 'swipetabs',
		tabBarPosition: 'bottom',
		tabBar: {
			hidden: true
		},
		items: [
			{
				xtype: 'TrackSearch',
				title: 'Search',
				tabIndex: 0
			},
			{
				xtype: 'TrackList',
				title: 'Tracks',
				tabIndex: 1
			},
			{
				xtype: 'TrackLyrics',
				title: 'Lyrics',
				tabIndex: 2
			}
		]
	}
});
