import { useParams } from "react-router-dom";
import { useStudentCourseFeesContext } from "../courseFees/StudentCourseFeesContext";
import { useState, useEffect, useCallback, useRef } from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import Loader from "../../../_metronic/layout/components/loader/Loader";

const OldStudentMonthlyInstallmentCollection = () => {
    const [toDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [totalCollection, setTotalCollection] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [allData, setAllData] = useState([]);
    const paramsData = useParams();
    const ctx = useStudentCourseFeesContext();
    const { data, isLoading } = ctx.getAllStudentsCourseFees;

    // Reference for the scrollable container
    const containerRef = useRef(null);

    useEffect(() => {
        if (data) {
            // Filter data to get relevant monthly installment collections
            const filteredData = data.filter((item) => {
                const companyId = item?.companyName
                const amountDate = new Date(item?.amountDate); // Date when installment was created
                const studentCreationDate = new Date(item?.studentInfo?.createdAt); // Date when student was created

                return (
                    item?.amountPaid && companyId === paramsData?.id &&
                    item?.studentInfo?.dropOutStudent === false &&
                    amountDate.getMonth() === toDate.getMonth() && amountDate.getFullYear() === toDate.getFullYear() &&
                    (studentCreationDate.getMonth() < toDate.getMonth() || studentCreationDate.getFullYear() < toDate.getFullYear())
                );
            });

            const topData = filteredData.slice(0, page * 100);
            setAllData(topData);
            console.log(topData)
            setTotalCollection(filteredData.reduce((total, collection) => total + (collection?.amountPaid || 0), 0));
            setTotalStudents(filteredData.length);
        }
    }, [data, page, toDate]);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (container) {
            const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;
            if (bottom && !isLoading) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    const itemHeight = 60; // Adjust this value according to the actual item height
    const maxItems = 7; // Max number of items to display

    return (
        <div className={`card`}>
            {/* begin::Header */}
            <div className='card-header border-0 py-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Old Students</span>
                    <span className='text-muted fw-semibold fs-7'>Paid Installment Collections</span>
                </h3>

                <div className='card-toolbar flex-column align-items-start'>
                    <span className='text-muted fw-semibold fs-7'>{`Monthly Collection => ${totalCollection?.toFixed(2) || 0}`}</span>
                    <span className='text-muted fw-semibold fs-8'>{`Total Students => ${totalStudents}`}</span>
                </div>
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className='card-body'>
                <div
                    ref={containerRef}
                    className='scrollable-container mt-5'
                    style={{
                        height: `${itemHeight * maxItems}px`, // Fixed height based on 7 items
                        overflowY: 'auto',
                        paddingRight: '15px', // Adjust for scrollbar width
                    }}
                >
                    {/* begin::Items */}
                    {isLoading ? <Loader /> : allData.length > 0 ? (
                        <>
                            {allData?.filter((company) => company.companyName === paramsData.id)?.map((collection) => (
                                <div className='d-flex flex-stack mb-5' key={collection._id}>
                                    {/* begin::Section */}
                                    <div className='d-flex align-items-center me-2'>
                                        {/* begin::Symbol */}
                                        <div className='symbol symbol-50px me-3'>
                                            <div className='symbol-label bg-light'>
                                                <img
                                                    src={
                                                        collection?.studentInfo?.image
                                                            ? `${process.env.REACT_APP_BASE_URL}/api/images/${collection.studentInfo.image}`
                                                            : toAbsoluteUrl('/media/avatars/300-1.jpg')
                                                    }
                                                    alt='Student'
                                                    className='h-50 w-50'
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>
                                        {/* end::Symbol */}

                                        {/* begin::Title */}
                                        <div>
                                            <a onClick={() => window.open(`/profile/student/${collection?.studentInfo?._id}`, '_blank')}
                                                target="_blank"
                                                style={{ cursor: 'pointer' }}
                                                className='fs-6 text-gray-800 text-hover-primary fw-bold '>
                                                {collection?.studentInfo?.name}
                                            </a>
                                            <div className='fs-7 text-muted fw-semibold mt-1'>
                                                {collection?.courseName?.courseName}
                                            </div>
                                        </div>
                                        {/* end::Title */}
                                    </div>
                                    {/* end::Section */}

                                    {/* begin::Label */}
                                    <div className='badge badge-light fw-semibold py-4 px-3'>
                                        {collection?.amountPaid?.toFixed(2)}
                                    </div>
                                    {/* end::Label */}
                                </div>
                            ))}
                            {Array.from({ length: maxItems - allData.length }).map((_, index) => (
                                <div className='d-flex flex-stack mb-5' key={`placeholder-${index}`}>
                                    {/* Empty placeholders */}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className='d-flex flex-stack mb-5'>
                            No Collection is Found!!
                        </div>
                    )}
                    {/* end::Items */}
                </div>
            </div>
            {/* end::Body */}
        </div>
    );
};

export default OldStudentMonthlyInstallmentCollection;
