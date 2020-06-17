// 마이페이지 헤더
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Subheader from '../Header/Subheader'
import { Box, Typography, makeStyles, Divider } from '@material-ui/core'
import RawNameAvatar from '../common/RawNameAvatar'
import { yujinserver } from '../../restfulapi'
import FollowButton from '../Community/FollowButton'
import Logo from '../../../public/logo.png'

const useStyles = makeStyles((theme) => ({
  background: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    backgroundImage: `url(`+Logo+`)`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "150%",
    width: "100%",
  },
  filter: {
    backdropFilter: `grayscale(0.5) blur(15px)`,
    WebkitBackdropFilter: `grayscale(0.5) blur(15px)`,
  },
  user: {
    backgroundColor: "rgb(255,255,255)",
    backgroundColor: "rgba(255,255,255, 0.4)",
    borderRadius: 50,
  }
}));

const MypageSubheader = ({authStore, userId, }) => {
  const classes = useStyles();
  const [menus, setMenus] = useState([])
  const [namePlate, setNamePlate] = useState(null)
  const isOwner = parseInt(userId) === authStore.currentId
  useEffect(() => {
    fetch(yujinserver+"/user/"+userId, {credentials: "include"})
    .then(
      (res) => res.json(),
      (error) => console.error(error)
    )
    .then((user) => {
      setNamePlate(
        <Box p={3} display="flex" flexDirection="row" alignItems="center" className={classes.user}>
          <RawNameAvatar size={10} name={user.name} />
          <Box px={2} display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="h5">{user.name}</Typography>
              {!isOwner?<FollowButton targetuserid={parseInt(userId)} />:null}
            </Box>
            <Box pt={1} display="flex" flexDirection="row">
              <Box pr={2} display="flex" flexDirection="column">
                <Typography variant="body2">팔로잉 수</Typography>
                <Divider />
                <Typography align="right" variant="h6">{user.Followingnum}</Typography>
              </Box>
              <Box pr={2} display="flex" flexDirection="column">
                <Typography variant="body2">팔로워 수</Typography>
                <Divider />
                <Typography align="right" variant="h6">{user.Followernum}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )
    })
    if(isOwner){
      setMenus([
        {component: "💎추천코디 공유글", path: "/mypage/"+userId+"?design"},
        {component: "👀커뮤니티 게시글", path: "/mypage/"+userId+"?community"},
        {component: "📬쪽지함", path: "/mypage/"+userId+"?community"},
        {component: "✨나의 옷장", path: "/closet/"+userId},
      ])
    }
    else setMenus([
      {component: "💎추천코디 공유글", path: "/mypage/"+userId+"?design"},
      {component: "👀커뮤니티 게시글", path: "/mypage/"+userId+"?community"},
    ])
  }, [userId])

  return(
    <Box display="flex" flexDirection="column">
      <Box className={classes.background}>
        <Box px={6} py={3} display="flex" className={classes.filter}>
          {namePlate}
        </Box>
      </Box>
      <Subheader menus={menus} additionalButton={null}/>
    </Box>
  )
}

MypageSubheader.propTypes = {
  //pathname: PropTypes.string,
  //search: PropTypes.string,
  //hash: PropTypes.string,
}


const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  //search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(MypageSubheader)