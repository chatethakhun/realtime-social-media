interface ProfileImageProps {
    imageUrl: string | null | undefined
}

const ProfileImage = ({ imageUrl }: ProfileImageProps) => {
    return <div className='img-profile'>
        <div className='w-[30px] h-[30px] md:w-[60px] md:w-[60px] rounded-full bg-no-repeat bg-cover bg-center '
            style={{ backgroundImage: `url(${ imageUrl || 'https://source.unsplash.com/user/c_v_r'})` }}
        >

        </div>
    </div>
}

export default ProfileImage