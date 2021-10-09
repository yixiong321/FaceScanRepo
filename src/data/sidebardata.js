import { FaHome, FaUserTie, FaUserPlus, FaUsersCog } from 'react-icons/fa'

const sidebardata = [
    {
        name: 'Home',
        link: '/home',
        id: 'link-1',
        icon: <FaHome />
    },
    {
        name: 'Create TA Account',
        link: '/create-ta-account',
        id: 'link-2',
        icon: <FaUserTie />
    },
    {
        name: 'Register Student',
        link: '/register-student',
        id: 'link-3',
        icon: <FaUserPlus />
    },
    {
        name: 'Manage Student Profile',
        link: '/manage-student-profile',
        id: 'link-4',
        icon: <FaUsersCog />
    }
]

export default sidebardata;