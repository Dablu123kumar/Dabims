import { useCompanyContext } from "../compay/CompanyContext"


const SelectCompany = () => {
  const {getCompanyLists, selectedCompany, setSelectedCompany} = useCompanyContext()

  const companies = getCompanyLists?.data || []

  return (
    <select
      className='form-select form-select-solid w-250px'
      value={selectedCompany?._id || ''}
      onChange={(e) => {
        const company = companies.find((c) => c._id === e.target.value)
        setSelectedCompany(company)
      }}
    >
      <option value=''>Select Company</option>
      {companies.map((company) => (
        <option key={company._id} value={company._id}>
          {company.companyName}
        </option>
      ))}
    </select>
  )
}

export default SelectCompany
