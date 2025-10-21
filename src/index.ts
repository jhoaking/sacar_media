export function getTeewt(tweetId: string) {
  const twitterEpoch = 1288834974657n;
  const timestamp = (BigInt(tweetId) >> 22n) + twitterEpoch;
  const date = new Date(Number(timestamp));
  return date.toLocaleString();
}

console.log("date", getTeewt("28798813530"));
