import { PageLink, PageTitle } from '../../_metronic/layout/core'
import { UsersListWrapper } from "../modules/apps/user-management/users-list/UsersList";

const usersBreadcrumbs: Array<PageLink> = [
    {
        title: 'User Management',
        path: '/apps/user-management/users',
        isSeparator: false,
        isActive: false,
    },
    {
        title: '',
        path: '',
        isSeparator: true,
        isActive: false,
    },
]

function MyPage() {
    return (
        <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Schools Management</PageTitle>
            <UsersListWrapper />
        </>
    );
}

export default MyPage;   