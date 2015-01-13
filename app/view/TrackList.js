Ext.define('NerdyKaraoke.view.TrackList', {
	extend: 'Ext.List',
	xtype: 'TrackList',

	config: {
		grouped: true,
        indexBar: true,
        sorted: true,
        infinite: true,
        itemHeight: 48,
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
            maxAbsoluteVelocity: 2.5,
            momentumEasing: {
                momentum: {
                    acceleration: 60,
                    friction: 0.70
                },
                bounce: {
                    acceleration: 50,
                    springTension: .9
                },
                minVelocity: 1.5
            }
        }
	}
});
