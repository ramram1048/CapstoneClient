
// 이름에 따라 Avatar 색깔넣고 1글자이니셜하는거
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Avatar, Box, makeStyles, Popover, ButtonBase, Divider, Link, Tooltip, IconButton, Typography,
} from '@material-ui/core'
import FollowButton from '../Community/FollowButton';
import RawNameAvatar from './RawNameAvatar';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Mail, Chat } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  avatar: {
    // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
    backgroundColor: props => {
      var hash = 0;
      for (var i = 0; i < props.name.length; i++) {
        hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
    },
    width: props => theme.spacing(props.size),
    height: props => theme.spacing(props.size),
    fontSize: props => theme.spacing(props.size * 0.55),
  }
}));

const NameAvatarButton = ({authStore, name, userId, size = 5, push}) => {
  const classes = useStyles({name, size});
  const [popoverTarget, setPopoverTarget] = useState(null)
  const open = Boolean(popoverTarget);
  const id = open ? 'simple-popover' : undefined;
  
  const closePopover = () => {
    setPopoverTarget(null)
  }
  const pushTo = (url) => {
    push(url)
    closePopover()
  }

  return(
    <React.Fragment>
      <IconButton onClick={(event) => setPopoverTarget(event.target)}>
        <RawNameAvatar name={name} size={size} />
      </IconButton>
      <Popover
      id={id}
      open={open}
      anchorEl={popoverTarget}
      onClose={() => closePopover()}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}>
        <Box>
          <Box display="flex" flexDirection="column" px={10} py={3} alignItems="center" justifyContent="center">
            <ButtonBase onClick={() => pushTo("/mypage/"+userId)} >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box p={1}>
                  <RawNameAvatar name={name} size={10} />
                </Box>
                <Typography variant="h6">{name}</Typography>
              </Box>
            </ButtonBase>
            {authStore.currentId !== userId?(
              <Box alignItems="center">
                <FollowButton targetuserid={parseInt(userId)} />
                <Tooltip title="쪽지보내기">
                  <IconButton onClick={() => pushTo("/message/"+authStore.currentId+"?to="+userId)}>
                    <Chat />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : null}
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" p={1}>
            <Link onClick={() => pushTo("/mypage/"+userId+"?design")} color="inherit" >💎추천코디 공유글</Link>
            <Link onClick={() => pushTo("/mypage/"+userId+"?community")} color="inherit" >👀커뮤니티 게시글</Link>
          </Box>
        </Box>
      </Popover>
    </React.Fragment>
  )
}

NameAvatarButton.propTypes = {
    pathname: PropTypes.string.isRequired,
    //search: PropTypes.string,
    //hash: PropTypes.string,
}

const mapStateToProps = state => ({
  authStore: state.auth,
  //pathname: state.router.location.pathname,
  // search: state.router.location.search,
  //hash: state.router.location.hash,
})

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(NameAvatarButton)