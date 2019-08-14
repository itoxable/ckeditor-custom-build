import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class DbyImageSelector extends Plugin {

    fireImageSelector() {
        const editor = this.editor;
        window.DBYSettingsApp.selectSubMenu('IMAGE_SELECTION_SINGLE', (images) => {
            console.log(images);
            if (images && images.length) {
                console.log(editor);
                const image = images[0];
                editor.model.change( writer => {
                    console.log(writer);
                    const imageElement = writer.createElement( 'image', {
                        src: '/o/dby/file/'+ image.fileEntryId
                    } );
                    console.log(imageElement);
                    editor.model.insertContent( imageElement, editor.model.document.selection );
                    window.DBYSettingsApp.closeSubSettings(null);
                });
            }
        });
    }

    init() {
        const editor = this.editor;
        editor.ui.componentFactory.add( 'dbyImageSelector', locale => {
            const view = new ButtonView( locale );
            view.set( {
                label: 'Insert image',
                icon: imageIcon,
                tooltip: true
            } );
            view.on( 'execute', () => {
                if(window.DBYSettingsApp && window.DBYSettingsApp.selectMenu) {
                    this.fireImageSelector();
                } else {
                    let counter = 0;
                    const interval = setInterval(() => {
                        if(window.DBYSettingsApp) {
                            clearInterval(interval);
                            this.fireImageSelector();
                        } else if(counter === 20) {
                            clearInterval(interval);
                            console.error("Couldn't load Settings");
                        }
                        counter++;
                    }, 100);
                }

            } );

            return view;
        } );
    }
}