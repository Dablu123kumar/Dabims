import { useEffect, useState } from "react";
import { useCustomFormFieldContext } from "./CustomFormFieldDataContext";

const SelectDynamicFields = ({ selectId, setOpenModal }) => {
    const { useGetSingleDefaultSelectFieldById, updateDefaultSelectFieldMutation } = useCustomFormFieldContext();
    const selectField = useGetSingleDefaultSelectFieldById(selectId?._id);
    const defaultSelect = selectField?.data?.defaultSelect;
    const [defaultselectField, setdefaultselectField] = useState(defaultSelect || { selectName: "", options: [] });
    const [newOption, setNewOption] = useState("");

    // Update the state when defaultSelect changes
    useEffect(() => {
        if (defaultSelect) {
            setdefaultselectField(defaultSelect);
        }
    }, [defaultSelect]);

    // Handle changes in the select field name
    const handleSelectNameChange = (event) => {
        const updatedSelectName = event.target.value;
        setdefaultselectField((prev) => ({ ...prev, selectName: updatedSelectName }));
    };

    // Add a new option
    const handleAddOption = () => {
        if (newOption.trim() !== "") {
            const updatedOptions = [
                ...defaultselectField.options,
                { label: newOption, value: newOption.toLowerCase().replace(/\s+/g, '-') }, // customize value if needed
            ];
            setdefaultselectField((prev) => ({ ...prev, options: updatedOptions }));
            setNewOption(""); // Clear the input field
        }
    };

    // Remove an option by index
    const handleRemoveOption = (optionIndex) => {
        const updatedOptions = defaultselectField.options.filter((_, index) => index !== optionIndex);
        setdefaultselectField((prev) => ({ ...prev, options: updatedOptions }));
    };

    // Handle form submission to update the select field
    const handleUpdateSelectField = () => {
        // Call the mutation to update the select field (name and options)
        const updateSelect = {
            id: selectId?._id,
            data: defaultselectField
        }
        updateDefaultSelectFieldMutation.mutate(updateSelect, {
            onSuccess: () => {
                // toast.success('Field updated successfully')
                setOpenModal(false)
            },
            onError: (error) => {
                console.error('Error updating field:', error)
                // toast.error('Failed to update field')
            },
        })
    };

    return (
        <form className='dynamic-form'>
            <div className='field-container'>
                <input
                    type='text'
                    name='name'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Field Name'
                    value={defaultselectField.selectName || ""}
                    onChange={handleSelectNameChange} // Handle name changes
                />
                <div>
                    <div className='mt-2'>
                        {defaultselectField.options.map((option, optionIndex) => (
                            <div
                                key={optionIndex}
                                className='d-flex justify-content-between align-items-center'
                            >
                                <span>{option.label}</span>
                                <i
                                    className='bi bi-x-circle cursor-pointer'
                                    onClick={() => handleRemoveOption(optionIndex)}
                                ></i>
                            </div>
                        ))}
                    </div>
                    <input
                        type='text'
                        placeholder='New Option'
                        value={newOption}
                        onChange={(event) => setNewOption(event.target.value)}
                        className='form-control form-control-lg form-control-solid mt-2'
                    />
                    <button
                        type='button'
                        className='btn btn-primary mt-2'
                        onClick={handleAddOption}
                    >
                        <i className='bi bi-plus-circle'></i> Add Option
                    </button>
                </div>
            </div>
            <div>
                <button
                    disabled={!defaultselectField.selectName}
                    type='button'
                    className='btn btn-primary'
                    onClick={handleUpdateSelectField} // Handle updating the entire select field
                >
                    Add
                </button>
            </div>
        </form>
    );
};

export default SelectDynamicFields;
