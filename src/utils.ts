export function cmpVersion(targetVersion: string, comparingVersion: string): Number {
  const regExStrip0 = /(\.0+)+$/
  const segmentsA = targetVersion.replace(regExStrip0, '').split('.')
  const segmentsB = comparingVersion.replace(regExStrip0, '').split('.')
  const l = Math.min(segmentsA.length, segmentsB.length)

  let diff
  for (let i = 0; i < l; i++) {
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10)
    if (diff) {
      return diff
    }
  }

  return segmentsA.length - segmentsB.length
}

export function versionGreaterThan(targetVersion: string, comparingVersion: string): Boolean {
  return cmpVersion(targetVersion, comparingVersion) < 0
}
