Ext.define('NerdyKaraoke.view.Submit', {
	extend: 'Ext.form.Panel',
	xtype: 'Submit',

	config: {
		url: 'contact.php',
		scrollable: null,
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
		                label: 'Artist',
		                placeHolder: 'Freak Nasty'
		            },
		            {
		                xtype: 'textfield',
		                name: 'title',
		                label: 'Title',
		                placeHolder: 'Da Dip'
		            }
	            ]
	        },
	        {
	            xtype: 'toolbar',
	            layout: { 
	                pack: 'center' 
	            },
	            ui: 'plain',
	            items: {
	                xtype: 'button',
	                text: 'Send',
	                ui: 'confirm',
	                action: 'submitRequest'
	            }
	        }
		]
	}
});
