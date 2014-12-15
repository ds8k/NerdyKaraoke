Ext.define('NerdyKaraoke.view.Submit', {
	extend: 'Ext.form.Panel',
	xtype: 'Submit',

	config: {
		url: 'contact.php',
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
	                handler: function() {
	                    var form = this.up('formpanel');
	                    var models = Ext.create('NerdyKaraoke.model.RequestForm', form.getValues());
	                    var errors = models.validate();

	                    if(errors.isValid()) {
	                        form.submit();
	                        Ext.Msg.alert('Thanks!');
	                        form.reset();
	                    } else {
	                        var message = '';

	                        Ext.each(errors.items, function(record, index) {
								message += record.getMessage() + '<br/>';
	                        });

	                        Ext.Msg.alert('Uh oh!', message);
	                    }
	                }
	            }
	        }
		]
	}
});
