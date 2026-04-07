// Just copy this into a file like `experiment.ts` and run `ts-node experiment.ts`
// Or use any online TypeScript playground

// ============ SIMPLE DATA ============
const users = [
  { id: 1, name: "Alice", score: 95, active: true },
  { id: 2, name: "Bob", score: 67, active: false },
  { id: 3, name: "Charlie", score: 82, active: true },
  { id: 4, name: "Diana", score: 73, active: true },
]

// ============ BASIC FUNCTIONS ============
const getActiveUsers = (users: typeof users) => users.filter(u => u.active)

const averageScore = (users: typeof users) => 
  users.reduce((sum, u) => sum + u.score, 0) / users.length

const getUserNames = (users: typeof users) => users.map(u => u.name)

// ============ RUN IT ============
console.log("=== User Experiment ===\n")

console.log("All users:", users)
console.log("\nActive users:", getActiveUsers(users))
console.log("\nAverage score:", averageScore(users))
console.log("\nUser names:", getUserNames(users))

// ============ PLAY WITH TYPES ============
type User = typeof users[0]

const addPoints = (user: User, points: number): User => ({
  ...user,
  score: user.score + points
})

console.log("\nAfter +5 points:", addPoints(users[0], 5))

// ============ CLASS VERSION (no React) ============
class ScoreBoard {
  private scores: Map<number, number> = new Map()
  
  setScore(userId: number, score: number) {
    this.scores.set(userId, score)
  }
  
  getScore(userId: number): number | undefined {
    return this.scores.get(userId)
  }
  
  getAllScores() {
    return Array.from(this.scores.entries())
  }
}

const board = new ScoreBoard()
board.setScore(1, 100)
board.setScore(2, 85)
console.log("\nScoreBoard:", board.getAllScores())

// ============ ONE-LINER FUN ============
const shout = (msg: string) => msg.toUpperCase() + "!!!"
console.log("\n", shout("this is pure typescript"))
