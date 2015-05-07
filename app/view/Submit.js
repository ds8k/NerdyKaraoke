Ext.define('NerdyKaraoke.view.Submit', {
	extend: 'Ext.form.Panel',
	xtype: 'Submit',

	config: {
		url: 'control/contact.php',
		scrollable: true,
        items:[
	        {
	            xtype: 'fieldset',
	            instructions: 'Can\'t find your favorite song? </br> Let us know what you\'d like to sing! </br></br> Note: Please be realistic with your requests. Johnny YouTube probably won\'t have a karaoke version of his rap about Skyrim.',
	            items: [
		            {
		                xtype: 'textfield',
		                name: 'name',
		                label: 'Name'
		            },
		            {
		                xtype: 'emailfield',
		                name :'email',
		                label: 'Email'
		            },
		            {
		                xtype: 'textfield',
		                name: 'artist',
		                label: 'Artist'
		            },
		            {
		                xtype: 'textfield',
		                name: 'title',
		                label: 'Title'
		            }
	            ]
	        },
	        {
	        	xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    pack: 'middle',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0.75em 0.75em',
                    xtype: 'button'
                },
                items: {
	                text: 'Send Request',
	                ui: 'confirm',
	                action: 'submitRequest'
				}
	        }
		]
	}
});
