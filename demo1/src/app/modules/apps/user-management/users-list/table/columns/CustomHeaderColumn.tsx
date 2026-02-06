// @ts-nocheck
import {FC} from 'react'
import {ColumnInstance} from 'react-table'
import {User} from '../../core/_models'

type Props = {
  column: ColumnInstance<User>
}

const CustomHeaderColumn: FC<Props> = ({column}) => {
  //  console.log(column);

  return (
    <>
      {column.Header && typeof column.Header === 'string' ? (
        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
      ) : (
        column.render('Header')
      )}
    </>
  )
}

export {CustomHeaderColumn}
