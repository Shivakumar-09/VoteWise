import { PrismaClient, ElectionType, ElectionStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding VoteWise AI database...')

  // Clean up
  await prisma.feedback.deleteMany()
  await prisma.supportRequest.deleteMany()
  await prisma.reminder.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.pollingBooth.deleteMany()
  await prisma.election.deleteMany()

  // Elections
  const loksabha = await prisma.election.create({
    data: {
      title: 'Lok Sabha General Election 2024',
      type: ElectionType.GENERAL,
      phase: 'Phase 1',
      pollingDate: new Date('2024-04-19'),
      resultDate: new Date('2024-06-04'),
      deadline: new Date('2024-03-12'),
      status: ElectionStatus.COMPLETED,
      description: 'The 18th General Election to constitute the 18th Lok Sabha.',
    },
  })

  const telangana = await prisma.election.create({
    data: {
      title: 'Telangana Assembly Election 2023',
      type: ElectionType.STATE_ASSEMBLY,
      state: 'Telangana',
      pollingDate: new Date('2023-11-30'),
      resultDate: new Date('2023-12-03'),
      deadline: new Date('2023-11-13'),
      status: ElectionStatus.COMPLETED,
      description: 'State Assembly election for 119 constituencies in Telangana.',
    },
  })

  const upcoming = await prisma.election.create({
    data: {
      title: 'Bihar Assembly Election 2025',
      type: ElectionType.STATE_ASSEMBLY,
      state: 'Bihar',
      pollingDate: new Date('2025-10-15'),
      resultDate: new Date('2025-10-20'),
      deadline: new Date('2025-09-20'),
      status: ElectionStatus.UPCOMING,
      description: 'State Assembly election for 243 constituencies in Bihar.',
    },
  })

  // Candidates
  await prisma.candidate.createMany({
    data: [
      {
        name: 'Narendra Modi',
        party: 'Bharatiya Janata Party',
        partyShort: 'BJP',
        symbol: '🪷',
        constituency: 'Varanasi',
        state: 'Uttar Pradesh',
        education: 'M.A. Political Science',
        assets: '₹3.02 Crore',
        liabilities: '₹0',
        criminalCases: 0,
        experience: '23 years (CM Gujarat + PM India)',
        age: 73,
        gender: 'Male',
        electionId: loksabha.id,
      },
      {
        name: 'Rahul Gandhi',
        party: 'Indian National Congress',
        partyShort: 'INC',
        symbol: '✋',
        constituency: 'Rae Bareli',
        state: 'Uttar Pradesh',
        education: 'M.Phil Development Studies, Cambridge',
        assets: '₹20.17 Crore',
        liabilities: '₹0',
        criminalCases: 1,
        experience: '19 years as MP',
        age: 53,
        gender: 'Male',
        electionId: loksabha.id,
      },
      {
        name: 'Arvind Kejriwal',
        party: 'Aam Aadmi Party',
        partyShort: 'AAP',
        symbol: '🧹',
        constituency: 'New Delhi',
        state: 'Delhi',
        education: 'B.Tech IIT Kharagpur',
        assets: '₹3.4 Crore',
        liabilities: '₹0',
        criminalCases: 0,
        experience: '12 years (CM Delhi)',
        age: 55,
        gender: 'Male',
        electionId: loksabha.id,
      },
      {
        name: 'A. Revanth Reddy',
        party: 'Indian National Congress',
        partyShort: 'INC',
        symbol: '✋',
        constituency: 'Kodangal',
        state: 'Telangana',
        education: 'B.Tech',
        assets: '₹105 Crore',
        liabilities: '₹12 Crore',
        criminalCases: 2,
        experience: '15 years in politics',
        age: 54,
        gender: 'Male',
        electionId: telangana.id,
      },
      {
        name: 'K. Chandrashekar Rao',
        party: 'Bharat Rashtra Samithi',
        partyShort: 'BRS',
        symbol: '🚗',
        constituency: 'Gajwel',
        state: 'Telangana',
        education: 'B.A. Telugu Literature',
        assets: '₹195 Crore',
        liabilities: '₹0',
        criminalCases: 0,
        experience: '25 years, founded Telangana state',
        age: 69,
        gender: 'Male',
        electionId: telangana.id,
      },
    ],
  })

  // Polling Booths
  await prisma.pollingBooth.createMany({
    data: [
      {
        boothCode: 'AP-HYD-001',
        name: 'Government Primary School, Banjara Hills',
        address: 'Road No. 12, Banjara Hills, Hyderabad',
        state: 'Telangana',
        district: 'Hyderabad',
        pincode: '500034',
        timing: '7:00 AM - 6:00 PM',
        latitude: 17.4126,
        longitude: 78.4372,
      },
      {
        boothCode: 'AP-HYD-002',
        name: 'Municipal High School, Jubilee Hills',
        address: 'Road No. 36, Jubilee Hills, Hyderabad',
        state: 'Telangana',
        district: 'Hyderabad',
        pincode: '500033',
        timing: '7:00 AM - 6:00 PM',
        latitude: 17.4319,
        longitude: 78.4072,
      },
      {
        boothCode: 'MH-MUM-001',
        name: 'Municipal School, Andheri West',
        address: 'Versova Road, Andheri West, Mumbai',
        state: 'Maharashtra',
        district: 'Mumbai',
        pincode: '400053',
        timing: '7:00 AM - 6:00 PM',
        latitude: 19.1136,
        longitude: 72.8697,
      },
      {
        boothCode: 'DL-NDL-001',
        name: 'Sarvodaya Vidyalaya, Connaught Place',
        address: 'Block A, Connaught Place, New Delhi',
        state: 'Delhi',
        district: 'Central Delhi',
        pincode: '110001',
        timing: '7:00 AM - 6:00 PM',
        latitude: 28.6315,
        longitude: 77.2167,
      },
      {
        boothCode: 'TN-CHN-001',
        name: 'Government Higher Secondary School, T. Nagar',
        address: 'Pondy Bazaar, T. Nagar, Chennai',
        state: 'Tamil Nadu',
        district: 'Chennai',
        pincode: '600017',
        timing: '7:00 AM - 6:00 PM',
        latitude: 13.0418,
        longitude: 80.2341,
      },
    ],
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
