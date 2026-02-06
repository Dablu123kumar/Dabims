import { useParams } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import PopUpModal from "../../../modules/accounts/components/popUpModal/PopUpModal";
import { useCompanyContext } from "../../compay/CompanyContext";
import { useState } from "react";
import LabFormFields from "./LabFormFields";
import { useAttendanceContext } from "../AttendanceContext";
import EditLab from "./EditLab";

const LabsList = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedLab, setSelectedLab] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')
    const companyCTX = useCompanyContext();
    const params = useParams();
    const companyId = params?.id;
    const { data: companyInfo } = companyCTX?.useGetSingleCompanyData(companyId);
    const { getAllLabsData, deleteLabDataMutation } = useAttendanceContext();

    const openAddTrainerModal = () => {
        setModalMode('add');
        setSelectedLab(null);
        setOpenModal(true);
    };

    const openEditLabModal = (lab) => {
        setModalMode('edit');
        setSelectedLab(lab);
        setOpenModal(true);
    };

    const filteredLabs = getAllLabsData?.data?.filter((lab) => searchTerm.trim() === "" || lab?.labName?.toLowerCase().includes(searchTerm?.toLowerCase()))

    const deleteHandler = (labId) => {
        deleteLabDataMutation.mutate(labId);
    };

    // const filteredLabs = getAllLabsData?.data?.filter((company) => company.companyId === params?.id);

    return (
        <>
            <div className={`card `}>
                <div className='card-header border-0 pt-5'>
                    <h3 className='card-title align-items-start flex-column'>
                        <span className='card-label fw-bold fs-3 mb-1'>Labs</span>
                    </h3>
                    <div className='search-bar'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Labs'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='card-toolbar'>
                        <button
                            className='btn btn-sm btn-light-primary'
                            onClick={openAddTrainerModal}
                        >
                            <KTIcon iconName='plus' className='fs-3' />
                            Add New Lab
                        </button>
                    </div>
                </div>

                <div className='card-body py-3'>
                    <div className='table-responsive'>
                        <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                            <thead>
                                <tr className='fw-bold text-muted'>
                                    <th className='w-25px'></th>
                                    <th className='min-w-150px'>Lab's Name</th>
                                    <th className='min-w-120px'>Company</th>
                                    <th className='min-w-100px text-end'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLabs?.length > 0 ? (
                                    filteredLabs?.filter((company) => company?.companyId === params?.id).map((lab) => (
                                        <tr key={lab._id}>
                                            <td>
                                                <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-start flex-column'>
                                                    <div
                                                        style={{ cursor: 'pointer' }}
                                                        className='text-dark fw-bold text-hover-primary fs-6'
                                                    >
                                                        {lab?.labName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-end'>
                                                <div className='d-flex flex-column w-100 me-2'>
                                                    <div
                                                        style={{ cursor: 'pointer' }}
                                                        className='d-flex flex-stack mb-2'
                                                    >
                                                        <span className='text-muted me-2 fs-7 fw-semibold'>
                                                            {companyInfo?.companyName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-end flex-shrink-0'>
                                                    <button
                                                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                        onClick={() => openEditLabModal(lab)}
                                                    >
                                                        <KTIcon iconName='pencil' className='fs-3' />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteHandler(lab?._id)}
                                                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                                                    >
                                                        <KTIcon iconName='trash' className='fs-3' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center fw-bold text-muted">
                                            No Lab Data Found !!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
                {modalMode === 'add' ? (
                    <LabFormFields setOpenModal={setOpenModal} />
                ) : (
                    <EditLab setOpenModal={setOpenModal} selectedLab={selectedLab?._id} />
                )}
            </PopUpModal>
        </>
    );
};

export default LabsList;
