import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
   allowlist: {
     "node_modules/@parcel/watcher@2.5.6": "ALLOW",
     "node_modules/cypress@15.14.0": "ALLOW",
     "node_modules/dtrace-provider@0.8.8": "ALLOW",
     "node_modules/esbuild@0.27.7": "ALLOW",
     "node_modules/fsevents@2.3.3": "ALLOW"
   },
})
