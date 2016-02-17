Ext.define('NerdyKaraoke.view.CategoryContainer', {
	extend: 'Ext.tab.Panel',
	xtype: 'CategoryContainer',

	config: {
		tabBarPosition: 'bottom',
		tabBar: {
			hidden: true
		},
		items: [
			{
				xtype: 'Category',
				title: 'Category',
				tabIndex: 1
			},
			{
				xtype: 'CategoryLyrics',
				title: 'CategoryLyrics',
				tabIndex: 2
			}
		]
	}
});
