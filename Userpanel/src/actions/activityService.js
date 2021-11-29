import axios from 'axios';
import config from '../lib/config';

export async function getAllActivity() {
        //console.log("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/allActivity`,

                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}