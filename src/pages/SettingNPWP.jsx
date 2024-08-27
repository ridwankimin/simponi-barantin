import React from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import { useUpdateNPWP } from '../hooks/useKuitansi';
import toast from 'react-hot-toast';
import { useGetUser } from '../hooks/useAuth';
import { useState } from 'react';

function SettingNPWP({
  show,
  handleClose,
  dataUpt
}) {
    console.log("dataUpt")
    console.log(dataUpt?.data?.npwp)
    const user = useGetUser()
    const { mutateAsync, isPending } = useUpdateNPWP()
    const npwpsimpan = dataUpt?.data?.npwp
    let [npwpUPT, setNpwpUPT] = useState(npwpsimpan ?? "")

    const onSubmit = async (e) => {
        e.preventDefault()
        if (npwpUPT) {
            const json = {
                upt: user?.upt?.toString()?.slice(0,2),
                npwp: npwpUPT
            };
            console.log(json)
            const toastId = toast.loading('Loading...');
            const response = await mutateAsync(json);
            console.log("response values")
            console.log(response)
            if (response?.status) {
                toast.dismiss(toastId);
                toast.success(response?.message || 'Berhasil update NPWP')
            } else {
                toast.dismiss(toastId);
                toast.error(response?.message || 'Gagal update NPWP')
            }
        } else {
            toast.error('Mohon isi NPWP bendahara')
        }
    }
    return (
        <Modal className="modal-md" show={show} onHide={handleClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Setting NPWP Bendahara</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col sm={12} md={12} className='mb-3'>
                        <input
                            className="form-control"
                            placeholder='NPWP Bendahara UPT..'
                            value={npwpUPT}
                            autoComplete='off'
                            maxLength={22}
                            onChange={(e) => setNpwpUPT(e.target.value)}
                            required
                        />
                    </Col>
                    <Button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isPending ? true : false}
                    >
                        <i className="ri-save-2-fill me-2"></i>{isPending ? "Loading.." : "Simpan"}
                    </Button>
                </Modal.Body>
            </form>
        </Modal>
    )
}

export default SettingNPWP