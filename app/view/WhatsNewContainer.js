Ext.define('NerdyKaraoke.view.WhatsNewContainer', {
	extend: 'Ext.tab.Panel',
	xtype: 'WhatsNewContainer',

	config: {
		tabBarPosition: 'bottom',
		tabBar: {
			hidden: true
		},
		items: [
			{
				xtype: 'WhatsNew',
				title: 'WhatsNew',
				tabIndex: 1
			},
			{
				xtype: 'WhatsNewLyrics',
				title: 'WhatsNewLyrics',
				tabIndex: 2
			}
		]
	}
});
