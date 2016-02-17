Ext.define('NerdyKaraoke.view.Category', {
    extend: 'Ext.List',
    xtype: 'Category',

    config: {
        grouped: true,
        sorted: true,
        infinite: true,
        itemHeight: 45,
        variableHeights: true,
        disableSelection: true,
        pinHeaders: true,
        cls: 'lizt',
        itemTpl: '{Title}',
        emptyText: 'Send requests to</br>requests@nerdykaraoke.com',
        store: 'Category',
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
                    springTension: 0.9
                },
                minVelocity: 0.5
            }
        }
    }
});
