Ext.define('NerdyKaraoke.view.TrackContainer', {
	extend: 'Ext.tab.Panel',
	xtype: 'TrackContainer',
	requires: ['Ext.ux.touch.SwipeTabs'],

	config: {
		tabBarPosition: 'bottom',
		items: [
			{
				xtype: 'TrackSearch',
				iconCls: 'search',
				title: 'Search',
				tabIndex: 0
			},
			{
				xtype: 'TrackList',
				iconCls: 'music',
				title: 'Tracks',
				tabIndex: 1
			},
			{
				xtype: 'TrackLyrics',
				title: 'Lyrics',
				tabIndex: 2,
				hidden: true
			}
		]
	}
});
