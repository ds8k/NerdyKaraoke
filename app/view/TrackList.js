Ext.define('NerdyKaraoke.view.TrackList', {
	extend: 'Ext.List',
	xtype: 'TrackList',

	config: {
		grouped: true,
        indexBar: true,
        sorted: true,
        infinite: true,
        itemHeight: 45,
        variableHeights: false,
        disableSelection: true,
        pinHeaders: true,
        cls: 'lizt',
        itemTpl: '{Title}',
        emptyText: 'Send requests to requests@nerdykaraoke.com',
        store: 'Karaoke',
        maskOnOpen: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true,
            indicators: false,
            maxAbsoluteVelocity: 1.5,
            momentumEasing: {
                momentum: {
                    acceleration: 20,
                    friction: 1.5
                },
                bounce: {
                    acceleration: 50,
                    springTension: .9
                },
                minVelocity: 0.5
            }
        }
	}
});
