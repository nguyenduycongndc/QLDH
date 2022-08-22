using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using QuanLyDonHang.Service.Interface;
using QuanLyDonHang.Repository.Interfaces;

namespace QuanLyDonHang.Service.Services
{
    public class EcommerceServices<T> :  IServices<T> where T : class
    {
        private readonly IRepository<T> _baseReponsitory;

        public EcommerceServices(IRepository<T> baseReponsitory)
        {
            _baseReponsitory = baseReponsitory;
        }

        #region Async

        public async Task<ICollection<T>> FindAllAsync(Expression<Func<T, bool>> match)
        {
           return await _baseReponsitory.FindAllAsync(match);
        }

        public async Task<T> FindAsync(Expression<Func<T, bool>> match)
        {
            return await _baseReponsitory.FindAsync(match);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _baseReponsitory.GetByIdAsync(id);
        }

        public async Task<IList<T>> GetAllAsync()
        {
            return await _baseReponsitory.GetAllAsync();
        }

        public async Task<T> AddAsync(T entity)
        {
            return await _baseReponsitory.AddAsync(entity);
        }

        public async Task<bool> AddManyAsync(IEnumerable<T> entities)
        {
            return await _baseReponsitory.AddManyAsync(entities);
        }

        public async Task UpdateAsync(T entity)
        {
             await _baseReponsitory.UpdateAsync(entity);
        }

        public async Task DeleteAsync(int Id)
        {
            await _baseReponsitory.DeleteAsync(Id);
        }

        #endregion

        #region Normal

        public T GetById(int id)
        {
            return _baseReponsitory.GetById(id);
        }

        public IQueryable<T> GetAll()
        {
            return _baseReponsitory.GetAll();
        }

        public T Find(Expression<Func<T, bool>> match)
        {
            return _baseReponsitory.Find(match);
        }

        public ICollection<T> FindAll(Expression<Func<T, bool>> match)
        {
            return _baseReponsitory.FindAll(match);
        }

        public T Get(int id)
        {
            throw new NotImplementedException();
        }

        public IQueryable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            throw new NotImplementedException();
        }

        public T Add(T entity)
        {
            throw new NotImplementedException();
        }

        public bool AddMany(IEnumerable<T> entities)
        {
            throw new NotImplementedException();
        }

        public void Update(T entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(T entity)
        {
            throw new NotImplementedException();
        }

        #endregion

    }
}
