import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { sessionOneRepMax } from '../../../lib/oneRepMax';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const exerciseTypeId = params.get('exerciseTypeId');
    const userId = params.get('userId');

    const entries = await prisma.workoutEntry.findMany({
      where: {
        ...(exerciseTypeId ? { exerciseTypeId } : {}),
        ...(userId ? { userId } : {}),
      },
      include: {
        user: { select: { id: true, username: true } },
        exerciseType: { select: { id: true, name: true, weightLabel: true } },
        sets: true,
      },
      orderBy: { date: 'asc' },
    });

    const points = entries
      .map((entry) => ({
        id: entry.id,
        date: entry.date,
        userId: entry.user.id,
        username: entry.user.username,
        exerciseTypeId: entry.exerciseType.id,
        exerciseTypeName: entry.exerciseType.name,
        oneRepMax: sessionOneRepMax(entry.sets),
      }))
      .filter((p) => p.oneRepMax !== null);

    return NextResponse.json(points);
  } catch (error) {
    console.error('Erreur GET /api/progress', error);
    return NextResponse.json({ error: 'Erreur lors du calcul de la progression' }, { status: 500 });
  }
}
