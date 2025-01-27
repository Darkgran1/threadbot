import { WebAPICallResult } from '@slack/web-api'
import { send } from 'micro'
import { get } from 'microrouter'

import { initAllFeaturesForTeam } from '../features'
import web, { slackClientId, slackClientSecret } from '../init/web'
import { Team } from '../models/team'

export default [
  get('/oauth', async (req, res) => {
    const { code, error } = req.query

    if (error) {
      send(res, 400, { ok: false, message: error })
      return
    }

    if (!code) {
      send(res, 400, { ok: false, message: 'Missing required paremeter: code' })
      return
    }

    let response
    try {
      response = await web.oauth.access({
        client_id: slackClientId,
        client_secret: slackClientSecret,
        code,
      })
      if (!(response && response.ok)) throw new Error('Invalid response')
    } catch (error) {
      console.error(error)
      send(res, 500, { ok: false, ...(error.data || error) })
      return
    }

    const {
      access_token,
      bot: { bot_user_id, bot_access_token },
      scope,
      team_id,
      team_name,
      user_id,
    } = (response || {}) as WebAPICallResult & Record<string, any>

    try {
      const team = await Team.findByIdAndUpdate(
        team_id,
        {
          $addToSet: { users: user_id },
          _id: team_id,
          access_token,
          bot: { _id: bot_user_id, access_token: bot_access_token },
          name: team_name,
          scope,
        },
        { new: true, upsert: true },
      )
      initAllFeaturesForTeam(team.toObject())
    } catch (error) {
      console.error(error)
      send(res, 500, { ok: false, message: error.message })
      return
    }

    // send(res, 200, { ok: true, bot_user_id, scope, team_id, team_name, user_id })

    res.setHeader(
      'Location',
      `https://slack.com/app_redirect?channel=general${team_id ? `&team=${team_id}` : ''}`,
    )
    send(res, 302)
  }),
]
