import { getRepository } from 'typeorm';
import { Review } from './review.model';
import { validate } from 'class-validator';

async function list({ page = 0, perPage = 9, isVerify = false } = {}) {
  const skip = page * perPage;
  const take = perPage;
  const where = isVerify ? { isVerify } : {};

  try {
    const reviewRepository = getRepository(Review);
    const [reviews, count] = await reviewRepository.findAndCount({ where, skip, take });
    const pageCount = Math.ceil(count / perPage);

    if (page >= pageCount)
      throw { code: 404, details: `Page n°${page} cannot be found with ${perPage} items per page` };

    const metadataPayload = {
      page,
      perPage,
      pageCount,
      totalItems: count,
      links: {
        self: `/reviews?page=${page}&perPage=${perPage}`,
        first: `/reviews?page=0&perPage=${perPage}`,
        previous: page === 0 ? null : `/reviews?page=${page - 1}&perPage=${perPage}`,
        next: page + 1 >= pageCount ? null : `/reviews?page=${page + 1}&perPage=${perPage}`,
        last: `/reviews?page=${pageCount - 1}&perPage=${perPage}`,
      },
    };

    return {
      references: reviews.map(review => review.toResponse(review)),
      metadata: metadataPayload,
    };
  } catch (err) {
    throw err;
  }
}

async function read(id: number) {
  try {
    const reviewRepository = getRepository(Review);
    const review: Review = await reviewRepository.findOneOrFail(id);

    return review;
  } catch (err) {
    throw err;
  }
}

async function create(body: any) {
  try {
    //Get parameters from the body
    let review = new Review();
    Object.keys(body).forEach(key => {
      review[key] = body[key];
    });

    //Validade if the parameters are ok
    await validate(review);

    //Try to save. If fails, the reviewname is already in use
    const reviewRepository = getRepository(Review);
    try {
      await reviewRepository.save(review);
    } catch (e) {
      // res.status(409).send("");
      throw 'reviewname already in use';
    }

    //If all ok, send 201 response
    return review.toResponse(review);
  } catch (err) {
    throw err;
  }
}

async function update(id: number, body: any) {
  try {
    //Try to find review on database
    const reviewRepository = getRepository(Review);
    let review: Review;
    try {
      review = await reviewRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      // res.status(404).send("review not found");
      throw 'review not found';
    }

    //Get values from the body
    Object.keys(body).forEach(key => {
      review[key] = body[key];
    });

    //Validate the new values on model
    await validate(review);

    //Try to safe, if fails, that means reviewname already in use
    try {
      await reviewRepository.save(review);
    } catch (e) {
      // res.status(409).send("reviewname already in use");
      throw 'reviewname already in use';
    }
    //After all send a 204 (no content, but accepted) response
    return;
  } catch (err) {
    throw err;
  }
}

async function destroy(id: number) {
  try {
    const reviewRepository = getRepository(Review);
    try {
      await reviewRepository.findOneOrFail(id);
    } catch (err) {
      // res.status(404).send("review not found");
      throw err;
    }
    await reviewRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return;
  } catch (err) {
    throw err;
  }
}

export {
  list,
  read,
  create,
  update,
  destroy,
};
