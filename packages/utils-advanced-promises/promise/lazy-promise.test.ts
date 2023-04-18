import { LazyPromise } from './lazy-promise';

const successfulPromiseConstructor = () => Promise.resolve('Success');
const errorPromiseConstructor = () => Promise.reject(new Error('Failure'));

it('should resolve when the promise is successful', async () => {
  const lazyPromise = new LazyPromise(successfulPromiseConstructor);
  await expect(lazyPromise).resolves.toBe('Success');
});

it('should reject when the promise encounters an error', async () => {
  const lazyPromise = new LazyPromise(errorPromiseConstructor);

  await expect(lazyPromise).rejects.toBeInstanceOf(Error);
  await expect(lazyPromise).rejects.toMatchObject({
    message: 'Failure'
  });
});

it('should not execute the promise constructor until then is called', () => {
  const promiseConstructor = jest.fn(successfulPromiseConstructor);
  const lazyPromise = new LazyPromise(promiseConstructor);
  expect(promiseConstructor).not.toHaveBeenCalled();
  expect(lazyPromise.executed).toBe(false);

  lazyPromise.then();
  expect(promiseConstructor).toHaveBeenCalledTimes(1);
  expect(lazyPromise.executed).toBe(true);
});

it('should call the onfulfilled and onrejected callbacks', async () => {
  const onSuccess = jest.fn();
  const onError = jest.fn();

  const lazySuccessPromise = new LazyPromise(successfulPromiseConstructor);
  await lazySuccessPromise.then(onSuccess, onError);
  expect(onSuccess).toHaveBeenCalledWith('Success');
  expect(onError).not.toHaveBeenCalled();

  const lazyErrorPromise = new LazyPromise(errorPromiseConstructor);
  try {
    await lazyErrorPromise.then(onSuccess, onError);
  } catch (err) {
    // no-op
  }
  expect(onSuccess).toHaveBeenCalledTimes(1);
  expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failure' }));
});