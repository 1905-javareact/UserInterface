import * as checkInClient from '../../axiosClients/checkInClient/checkInClient';
import * as cohortClient from '../../axiosClients/cohortClient/cohortClient';
import { toast } from "react-toastify";
import { ICheckIn } from '../../model/CheckIn.model';
import { ICohort } from '../../model/Cohort.model';
import { IUserCreateDto } from 'src/model/UserCreateDto.model';
import { IUser } from 'src/model/User.model';
import { getTodayStart, getTodayEnd } from 'src/include/utcUtil';
import { getManagerCohorts } from './manager.helpers';

export const managerTypes = {
  ADD_CHECK_INS: 'ADD_CHECK_INS',
  ADD_COHORT: 'ADD_COHORT',
  SELECT_COHORT: 'SELECT_COHORT',
  SET_CHECK_IN_COMMENT: 'SET_CHECK_IN_COMMENT',
  SET_CHECK_IN_LIST: 'SET_CHECK_IN_LIST',
  SET_COHORT_LIST: 'SET_COHORT_LIST',
  SET_TRAINERS: 'SET_TRAINERS'
}

/**
 * Set up manager list of classes and check-ins
 */
export const managerInit = () => (dispatch) => {
  getManagerCohorts()(dispatch)
  getManagerCheckIn(getTodayStart(), getTodayEnd())(dispatch);
}

/**
 * Update a check in with a comment
 * @param comment 
 */
export const managerPostComment = (managerComments: string, checkinId: number) => dispatch => {
  const body = {
    checkinId,
    managerComments
  }
  checkInClient.postManagerComment(body, checkinId)
    .then(response => {
      // console.log(response)
      toast.success("Comment submitted")
    })
    .catch(error => {
      // console.log(error)
      toast.warn("Unable to submit comment")
    })
}

/**
 * Get a list of manager's check ins
 * @param fromDate 
 * @param toDate  
 */
export const getManagerCheckIn = (fromDate: number, toDate: number) => dispatch => {
  checkInClient.getManagerCheckIn(fromDate, toDate)
    .then(response => {
      const checkinList = response.data.models.map(checkin => {
        return checkin as ICheckIn;
      })
      dispatch({
        payload: {
          checkIns: checkinList
        },
        type: managerTypes.SET_CHECK_IN_LIST
      });
    })
    .catch(error => {
      console.log(error);
    })
}

/**
 * Set current render check ins by given user id
 * @param userId 
 * @param fromDate 
 * @param toDate 
 */
export const getCheckInByUserId = (userId: number, fromDate: number, toDate: number) => (dispatch) => {
  checkInClient.getCheckInByUserId(userId, fromDate, toDate)
    .then(response => {
      const checkinList = response.data.map(checkin => {
        return checkin as ICheckIn;
      })
      dispatch({
        payload: {
          checkIns: checkinList
        },
        type: managerTypes.SET_CHECK_IN_LIST
      });
    })
    .catch(error => {
      console.log(error);
    })
}

/**
 * Set the current list of render check ins to the check ins in a given cohort id
 * @param cohortId 
 * @param checkInList 
 * @param cohortList 
 */
export const getCheckInByCohortId = (cohortId: number,
  fromDate: number,
  toDate: number
) => dispatch => {

  checkInClient.getCheckInByCohortId(cohortId, fromDate, toDate)
    .then(response => {
      const checkinList = response.data.map(checkin => {
        return checkin as ICheckIn;
      })
      dispatch({
        payload: {
          checkIns: checkinList
        },
        type: managerTypes.SET_CHECK_IN_LIST
      });
    })
    .catch(error => {
      console.log("error");
    })
}

/**
 * Set the current select cohort to be render
 * @param sCohort 
 */
export const selectCohort = (sCohort: ICohort) => dispatch => {
  setTimeout(() => {
    dispatch({
      payload: {
        currentCohort: sCohort
      },
      type: managerTypes.SELECT_COHORT
    });
  }, 500);
}

/**
 * Create a new cohort
 * @param cohortName 
 * @param cohortDescription 
 * @param userLists 
 */
export const managerPostCohort = (cohortName: string, cohortDescription: string, userList: IUserCreateDto[]) => dispatch => {
  cohortClient.postCohort(cohortName, cohortDescription, userList)
    .then(response => {
      const cohort = response.data as ICohort;
      cohortClient.getUsersByCohortId(cohort.cohortId)
        .then(cohortResponse => {
          cohort.userList = cohortResponse.data.map(user => user as IUser);
          console.log(cohort)
          dispatch({
            payload: {
              cohort
            },
            type: managerTypes.ADD_COHORT
          });
        })
    })
    .catch(error => {
      toast.warn(error.response.data.messages)
    })
}

export const managetPostUserToCohort = (cohortId: number, user: IUserCreateDto) => dispatch => {
  cohortClient.postUser(user)
    .then(response => {
      cohortClient.addUserToCohort(cohortId, response.data.userId)
        .then(resp => {
          toast.success("Successfully add user to cohort")
        })
        .catch(err => {
          toast.warn("Created user but unable to add to cohort")
        })
    })
    .catch(error => {
      toast.warn("Unable to create user")
    })
}