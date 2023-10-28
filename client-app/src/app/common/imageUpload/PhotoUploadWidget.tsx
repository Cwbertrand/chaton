import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react'
import PhotoWidgetDropzone from './PhotoWidgetDropzone'
import PhotoWidgetCropper from './PhotoWidgetCropper'
// import { Cropper } from 'react-cropper'

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}
export default observer (function PhotoUploadWidget({loading, uploadPhoto}: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function handleOnCrop() {
        if(cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    // this cancels the stored image in the client side
    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Rezie image' />
                {files && files.length > 0 && (
                    // <Image src={files[0].preview} />
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload' />
                {files && files.length > 0  && 
                    <>
                    <div className='img-preview' style={{minHeight: 200, overflow: 'hidden'}} />
                    <Button.Group widths={2}>
                        <Button onClick={handleOnCrop} loading={loading} positive icon='check' />
                        <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                    </Button.Group>
                    </>
                }
            </Grid.Column>
        </Grid>
    )
})
